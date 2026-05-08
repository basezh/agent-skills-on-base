# Slippage and Share/Asset Conversion

> **Using `@morpho-org/morpho-sdk`?** `maxSharePrice` / `minSharePrice` bounds are computed from on-chain state and applied automatically — default tolerance 3 bps, capped at 10%, overridable per action. The manual preview + tolerance patterns below apply only when dropping to `blue-sdk-viem` / `bundler-sdk-viem` directly for flows morpho-sdk doesn't expose. The protocol mechanics on this page are still relevant context in both cases.

## Background

MetaMorpho vaults are ERC-4626 compliant — deposits and withdrawals convert between underlying assets and vault shares at a dynamic exchange rate. This rate changes as interest accrues, new deposits arrive, or withdrawals occur. Between the moment a user previews a transaction and when it executes on-chain, the rate can shift, resulting in more or fewer shares than expected.

With a proper dead deposit in place, this is a **UX concern**, not a security vulnerability. But unprotected transactions give users a poor experience when the received amount deviates from what they were shown.

## Core ERC-4626 Operations

| Function | Input | Output | Use when |
|----------|-------|--------|----------|
| `deposit(assets, receiver)` | Exact asset amount | Variable shares | Depositing a known token amount |
| `mint(shares, receiver)` | Variable assets | Exact share amount | Needing a precise share count |
| `withdraw(assets, receiver, owner)` | Variable shares burned | Exact asset amount | Withdrawing a known token amount |
| `redeem(shares, receiver, owner)` | Exact shares burned | Variable assets | Full withdrawal or exiting a known share position |

## Preview Functions

These are read-only (non-state-changing) functions that estimate conversions:

| Function | Returns |
|----------|---------|
| `previewDeposit(assets)` | Estimated shares for a given deposit |
| `previewMint(shares)` | Estimated assets needed to mint shares |
| `previewWithdraw(assets)` | Estimated shares burned to withdraw assets |
| `previewRedeem(shares)` | Estimated assets received for redeeming shares |
| `convertToAssets(shares)` | Current share → asset conversion |
| `convertToShares(assets)` | Current asset → share conversion |

## Slippage Protection Pattern

### Deposits

```typescript
// 1. Preview expected shares
const expectedShares = await client.readContract({
  address: vaultAddress,
  abi: metaMorphoAbi,
  functionName: "previewDeposit",
  args: [depositAmount],
});

// 2. Calculate minimum acceptable (1% tolerance)
const minShares = expectedShares * 99n / 100n;

// 3. Execute deposit
const actualShares = await vault.deposit(depositAmount, receiver);

// 4. Verify
if (actualShares < minShares) {
  revert("Slippage exceeded tolerance");
}
```

### Withdrawals

```typescript
// 1. Preview expected assets
const expectedAssets = await client.readContract({
  address: vaultAddress,
  abi: metaMorphoAbi,
  functionName: "previewRedeem",
  args: [shareAmount],
});

// 2. Calculate minimum acceptable
const minAssets = expectedAssets * 99n / 100n;

// 3. Execute redemption
const actualAssets = await vault.redeem(shareAmount, receiver, owner);

// 4. Verify
if (actualAssets < minAssets) {
  revert("Slippage exceeded tolerance");
}
```

### Solidity (on-chain check)

```solidity
uint256 expectedShares = IVault(vault).previewDeposit(amount);
uint256 minShares = expectedShares * 99 / 100;
uint256 actual = IVault(vault).deposit(amount, msg.sender);
require(actual >= minShares, "Slippage exceeded");
```

## Full Withdrawals: Use `redeem()`, Not `withdraw()`

When exiting a position entirely, always use `redeem(shares, ...)` with the user's full share balance rather than `withdraw(assets, ...)` with a calculated asset amount.

**Why**: `withdraw()` converts a target asset amount back to shares and burns them. Due to rounding, this can leave behind a tiny amount of shares ("dust") that the user cannot easily withdraw. `redeem()` burns the exact share count, guaranteeing a clean exit.

```typescript
// Correct: full exit via redeem
const shares = await vault.balanceOf(user);
await vault.redeem(shares, user, user);

// Incorrect: may leave dust
const assets = await vault.convertToAssets(await vault.balanceOf(user));
await vault.withdraw(assets, user, user);
```

## Vault V2 Quirk: max* Functions Return Zero

Vault V2's `maxDeposit`, `maxMint`, `maxWithdraw`, and `maxRedeem` functions **always return zero**. This is a known deviation from the ERC-4626 standard.

**Impact on integrators**:
- Do not use these to check deposit/withdrawal limits
- Do not gate UI actions on these return values
- If your code checks `maxDeposit > 0` before allowing deposits, it will permanently block deposits on V2 vaults

**Workaround**: For capacity checks, query the vault's underlying market allocations and available liquidity directly, or use the simulation SDK to preview the operation.

## Interest Accrual and Timing

On-chain state changes continuously as interest accrues. A withdrawal amount valid at transaction preparation time may exceed available liquidity by execution time if:
- Other users withdraw in between
- Borrowers in underlying markets repay (changing allocation)
- The curator reallocates funds

When withdrawing near the limit, apply a small buffer (e.g., withdraw 99.5% of `maxRedeem` instead of 100%) or use `redeem()` with exact shares to avoid reverts.
