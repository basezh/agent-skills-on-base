# Dead Deposits (Inflation Attack Protection)

## Background

ERC-4626 vaults track ownership through shares. When a vault is empty, an attacker can exploit the initial deposit by:

1. Depositing a tiny amount (e.g., 1 wei) to receive 1 share
2. Donating a large amount of tokens directly to the vault (not via deposit)
3. The share price is now inflated — 1 share = huge amount of tokens
4. The next depositor's deposit gets rounded down to 0 shares, losing their funds to the attacker

A **dead deposit** prevents this by establishing a baseline share supply that makes price manipulation economically unfeasible. It must be the **very first transaction** on any new vault or market — any user deposit before the dead deposit enables the attack.

The burn address for all dead deposits: `0x000000000000000000000000000000000000dEaD`

## Vault V2

Target shares depend on the underlying asset's decimals:

```
targetShares = max(1e9, 10^(6 + max(0, 18 - decimals)))
```

| Asset decimals | Example tokens | Target shares | Approx. cost |
|---------------|----------------|---------------|-------------|
| 18 | WETH, wstETH, sUSDe, sUSDS | 1e9 | ~$0.10 |
| 8 | cbBTC, WBTC | 1e16 | ~$630 |
| 6 | USDC, USDT, PYUSD | 1e18 | ~$1.00 |

### Why these numbers

The formula ensures that at least 1e6 asset units back the dead shares. With 1e6 assets as baseline, even an extreme donation of 10M tokens only shifts the share price by less than 0.0001%. A user depositing more than 0.01 tokens would lose less than 0.01% of their deposit value.

### Execution steps

1. **Verify vault is empty**: Call `totalSupply()` — must return 0
2. **Approve tokens**: The vault's underlying asset must be approved for spending. The cost is approximately `targetShares / 10^(18 - decimals)` tokens.
3. **Mint dead shares**:

```solidity
vault.mint(TARGET_SHARES, 0x000000000000000000000000000000000000dEaD);
```

4. **Validate**: Call `convertToAssets(1e18)` — should approximate 1 token per share (within rounding)

### TypeScript example (Vault V2)

```typescript
import { encodeFunctionData, parseUnits } from "viem";
import { metaMorphoAbi } from "@morpho-org/blue-sdk-viem";

const DEAD = "0x000000000000000000000000000000000000dEaD" as const;

function getTargetShares(decimals: number): bigint {
  const exponent = Math.max(9, 6 + Math.max(0, 18 - decimals));
  return 10n ** BigInt(exponent);
}

// Approve the vault to spend the underlying asset first, then:
const mintData = encodeFunctionData({
  abi: metaMorphoAbi,
  functionName: "mint",
  args: [getTargetShares(assetDecimals), DEAD],
});
```

## Market V1

Markets use a fixed `1e9` shares regardless of the asset's decimals. This is because Morpho Blue uses `VIRTUAL_SHARES = 1e6` and `VIRTUAL_ASSETS = 1`, which already provides some baseline protection — the dead deposit amplifies it.

### Execution

```solidity
// Approve the loan token for spending on the Morpho singleton first, then:
morpho.supply(marketParams, 0, 1e9, 0x000000000000000000000000000000000000dEaD, "");
```

The second argument (`0`) means "supply zero assets, let the contract calculate from shares." The third argument (`1e9`) is the share amount.

**Cost example**: For a cbBTC/WBTC market (8 decimals), 1e9 shares ≈ 1000 satoshis ≈ $0.63.

## Vault V1

- **Standard (≥9 decimal tokens)**: `1e9` shares
- **Low-decimal tokens (<9 decimals)**: `1e12` shares

```solidity
vault.mint(targetShares, 0x000000000000000000000000000000000000dEaD);
```

## Active-Cap Requirement (Vault V2 with underlying V1 markets/vaults)

When a Vault V2 allocates to underlying Market V1 or Vault V1 positions, the dead deposit protection must extend to those as well. Specifically:

- `0xdead` must hold **1e9 supplyShares** in each **Market V1** that has a non-zero cap set by the Vault V2
- `0xdead` must hold **1e9 shares** in each **Vault V1** that has non-zero caps or is present in the Vault V2's withdraw queue

This means a full dead deposit setup for a Vault V2 may require multiple transactions across the vault itself, its underlying markets, and any referenced V1 vaults.

## Integration Checklist

- [ ] Dead deposit is the first transaction after vault/market creation
- [ ] `totalSupply()` confirmed zero before executing
- [ ] Correct share amount for the asset's decimal count
- [ ] For Vault V2: all underlying Market V1 and Vault V1 positions also have dead deposits
- [ ] Post-deposit validation via `convertToAssets()` confirms reasonable share price
