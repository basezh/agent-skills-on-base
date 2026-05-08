# Testing Guide

Catalog of test cases for Morpho integrations. Organized by domain — each section describes **what** to test and **why** it matters. Implementations should include their own test harness (e.g., `@morpho-org/test` with Vitest/Anvil fixtures).

---

## Vaults

### Deposit Tests

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Deposit into vault with sufficient balance | Shares received > 0; share balance increases | Basic happy path |
| Deposit with insufficient balance | Reverts with `InsufficientBalanceError` before submitting | Prevents wasted gas on guaranteed reverts |
| Deposit exceeding vault capacity (`maxDeposit`) | Reverts or warns before submitting | V1 vaults have deposit caps set by curators |
| Deposit with zero amount | Reverts with input validation error | Zero amounts waste gas or silently do nothing |
| Deposit to zero address | Reverts with address validation error | Tokens sent to zero address are permanently lost |
| Deposit with slippage exceeding tolerance | Blocked with `SlippageExceededError` | Prevents front-running / sandwich attacks inflating share price |
| Deposit with dead deposit missing | Share price manipulation is possible | First deposit must seed shares to `0xdead` — see [dead-deposits](dead-deposits.md) |
| Deposit into V2 vault (do not rely on `maxDeposit`) | Deposit succeeds despite `maxDeposit()` returning 0 | V2's `max*` functions always return zero — see [slippage](slippage.md) |
| Deposit with native ETH into WETH vault | ETH wrapped and deposited; vault asset matches `wNative` | Sending raw ETH to a non-WETH vault locks funds permanently |
| Deposit with USDT (non-zero existing allowance) | Allowance reset to 0 before new approval; deposit succeeds | USDT reverts if you change a non-zero allowance to another non-zero value |
| Deposit with DAI (no permit) | Uses standard `approve()`, not EIP-2612 permit | DAI does not support permit |

### Withdrawal Tests

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Full withdrawal via `redeem()` | Share balance drops to exactly 0; no dust remains | `withdraw()` can leave dust due to rounding — see [slippage](slippage.md) |
| Partial withdrawal | Correct asset amount received; remaining shares intact | Basic happy path |
| Withdrawal exceeding available liquidity | Reverts or warns before submitting | Funds deployed in underlying markets may not be instantly available |
| Withdrawal with slippage exceeding tolerance | Blocked before execution | Exchange rate can shift between preview and execution |
| Withdrawal near limit with buffer | Succeeds without revert | Withdrawing 100% of `maxRedeem` can race with other transactions |
| V1 vault `maxWithdraw()` vs V2 vault | V1 returns real value; V2 returns 0 | Different computation logic between versions |

### Vault Lifecycle Tests

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Dead deposit as first transaction on new vault | Shares minted to `0xdead` with correct formula per version | Prevents share-price inflation attack — see [dead-deposits](dead-deposits.md) |
| V2 dead deposit formula by decimals | 18-dec asset → 1e9 shares; 8-dec → 1e16; 6-dec → 1e18 | Formula: `max(1e9, 10^(6 + max(0, 18 - decimals)))` |
| V1 dead deposit | 1e9 shares (or 1e12 for tokens < 9 decimals) | Fixed formula |
| Active-cap requirement for V2 | `0xdead` holds 1e9 supplyShares in each underlying market/vault with non-zero caps | Missing dead deposits in underlying allocations re-enable the attack |

---

## Markets

### Supply Tests

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Supply to market with sufficient balance | Supply shares increase; position created | Basic happy path |
| Supply with insufficient balance | Reverts with `InsufficientBalanceError` | Catch before on-chain to save gas and give clear error |
| Supply with zero amount | Reverts with input validation error | Zero amounts silently do nothing |
| Supply to market missing dead deposit | 1e9 shares must exist at `0xdead` | Market is vulnerable to inflation attack without it |
| Supply immediately after market creation | IRM rate is stable | Empty market at 0% utilization triggers rate decay — see [adaptive-curve-irm](adaptive-curve-irm.md) |

### Borrow Tests

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Borrow with sufficient collateral (health factor > 1.1) | Borrow succeeds; health factor recalculated correctly | Basic happy path |
| Borrow that would drop health factor below 1.0 | Rejected before submission | Position becomes liquidatable — see health factor guards |
| Borrow that drops health factor between 1.0 and 1.1 | Warning emitted; user prompted to confirm | 10% buffer zone — approaching liquidation danger |
| Borrow with no collateral supplied | Reverts | Cannot borrow without collateral |
| Borrow at 100% utilization | Rate doubles every ~5 days; warn user | Aggressive rate compounding — see [adaptive-curve-irm](adaptive-curve-irm.md) |

### Repay Tests

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Partial repay | Borrow shares decrease by correct amount | Basic happy path |
| Full repay with `'max'` | Borrow shares drop to exactly 0 | Avoids needing exact share-to-asset calculation, which goes stale by execution |
| Repay with no existing debt (`borrowShares == 0`) | Reverts | Repaying non-existent debt wastes gas or silently does nothing |
| Repay with insufficient balance | Reverts with `InsufficientBalanceError` | Catch before submission |

### Collateral Tests

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Supply collateral | Collateral balance increases | Basic happy path |
| Withdraw collateral (health factor stays > 1.1) | Collateral decreases; health factor recalculated | Basic happy path |
| Withdraw collateral that would drop health factor below 1.0 | Rejected | Position becomes liquidatable |
| Withdraw more collateral than deposited | Reverts with `CollateralExceededError` | Cannot withdraw 10 ETH if only 5 deposited |
| Withdraw collateral with zero collateral balance | Reverts | No collateral to withdraw |

---

## Cross-Cutting Concerns

### Input Validation

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Malformed address (not checksummed, wrong length) | Rejected by `isAddress()` | Prevents silent on-chain failures |
| Zero address for any parameter | Rejected | Tokens/approvals to zero address = permanent loss |
| Negative or non-numeric amounts | Rejected | Invalid input should never reach the chain |

### Chain and Account Safety

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Provider chain ID doesn't match expected chain | `ChainIdMismatchError` at initialization | Wrong network = read wrong balances, submit to wrong contracts |
| Read-only account attempts write operation | `ReadOnlyAccountError` naming the method attempted | Prevents confusing failure deep in signing stack |
| Chain ID consistency between client and operation params | Error if mismatched | Cross-chain data corruption |

### Token Approvals

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| USDT: new approval with existing non-zero allowance | Reset to 0 first, then set new value (two txs) | USDT's `approve()` reverts on non-zero → non-zero change |
| Standard ERC-20 approval | Single approve transaction | Normal token behavior |
| DAI approval | Uses `approve()`, not `permit()` | DAI has non-standard permit that must not be used |

### Signature Security

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| EIP-712 signature verification after signing | `verifyTypedData()` confirms valid signature | Catches hardware wallet bugs or corrupted signing |
| Permit deadline | Set to `now + 2 hours` | Limits replay attack window |
| Permit2 spender | Hardcoded to GeneralAdapter1 address | Permit signed to wrong spender can drain tokens |
| Permit2 expiration within 4 hours | Treated as needing renewal | Prevent using nearly-expired allowances |

### Immutability

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Transaction object mutation after creation | Throws TypeError (strict mode) or silently fails | `Object.freeze()` / `deepFreeze()` prevents changing `to`, `data`, `value` after build |

### Health Factor Edge Cases

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| No borrow (zero debt) | Health factor = Infinity | Safe default — no debt means no liquidation risk |
| Zero oracle price | Health factor = Infinity | Division-by-zero safety |
| Health factor computed with BigInt throughout | No floating-point precision loss | Large token amounts lose precision with floats |

### Bad Debt

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| V1.0 market: bad debt realized | Share price drops atomically for all suppliers | Expected behavior — see [bad-debt](bad-debt.md) |
| V1.1+ market: bad debt tracked | `lostAssets` incremented; share price unchanged until explicit realization | Prevents flash-loan amplification |
| V1.0 vault used as collateral | Flagged as CRITICAL risk | Share-price manipulation possible |
| ERC4626 vault used as loan asset | Rejected or flagged as CRITICAL | Unpredictable liquidation incentives |

### Metadata and Encoding

| Test Case | What to Assert | Why |
|-----------|---------------|-----|
| Transaction origin field: valid hex, ≤ 4 bytes | Accepted | Normal case |
| Transaction origin field: invalid hex or > 4 bytes | Rejected | Malformed hex corrupts calldata; excess length bloats gas |

---

## Test Infrastructure

Use `@morpho-org/test` for Vitest/Anvil-based test fixtures. This provides:
- Forked mainnet state for realistic testing
- Pre-configured Morpho contract instances
- Test accounts with token balances

For React integrations, `@morpho-org/test-wagmi` extends the base fixtures with wagmi test configuration.

For framework-agnostic tests, `@morpho-org/morpho-test` provides core fixtures without framework dependencies.
