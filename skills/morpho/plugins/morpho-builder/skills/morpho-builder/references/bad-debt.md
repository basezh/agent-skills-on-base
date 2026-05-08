# Bad Debt Tracking

## Background

Bad debt occurs when a borrower's collateral value drops below their outstanding loan amount before liquidators can act. In this scenario, the protocol absorbs a loss — the loan cannot be fully repaid from the remaining collateral. How this loss is distributed to lenders depends on the vault version.

## V1.0: Immediate Realization

In MetaMorpho V1.0, bad debt is **realized immediately**. When a market position goes bad:

- The share price drops atomically for all suppliers in the affected market
- The loss is socialized across all suppliers proportionally
- This happens in a single transaction

### Flash-loan vulnerability

This creates a flash-loan amplification vector. An attacker can:

1. Flash-loan a large amount and deposit into the vault
2. Trigger bad debt realization in the same transaction
3. The attacker absorbs a disproportionate share of the loss
4. Withdraw and repay the flash loan

Because the deposit and realization happen atomically, the attacker can amplify the impact of bad debt on the vault.

**This is a key reason V1.0 vaults should not be used as collateral in other markets** — the share price can be manipulated within a single transaction.

## V1.1+: Deferred Tracking via `lostAssets`

MetaMorpho V1.1 and later versions **do not automatically realize bad debt**. Instead:

- Bad debt is tracked via the `lostAssets` field on the vault
- The share price is **unaffected** until an explicit realization is triggered
- This prevents flash-loan manipulation because the share price cannot be atomically shifted

### Implications for integrators

- **Share price stability**: V1.1+ share prices are more predictable — they only go up from interest accrual (ignoring explicit realization events)
- **Oracle safety**: V1.1+ vaults are safer as collateral because share prices cannot be flash-manipulated
- **Monitoring**: Track the `lostAssets` field to understand the vault's true health versus its reported share price

## Version Comparison

| Aspect | V1.0 | V1.1+ | V2 |
|--------|------|-------|-----|
| Bad debt realization | Immediate, automatic | Deferred, tracked via `lostAssets` | Deferred |
| Flash-loan risk | Vulnerable | Protected | Protected |
| Share price on bad debt | Drops atomically | Unchanged until explicit realization | Unchanged until explicit realization |
| Safe as collateral | No | Safer (if no unrealized bad debt) | Safer |
| Monitoring field | N/A | `lostAssets` | `lostAssets` |

## What This Means for Integration Decisions

- **Never use V1.0 vaults as collateral** in Morpho markets — the flash-loan vulnerability makes share prices manipulable
- **V1.1+ vaults are safer as collateral** but still require monitoring of `lostAssets` to understand true economic exposure
- **Do not list any ERC4626 vault as a loan asset** — share price manipulations (regardless of version) create unpredictable liquidation incentives
- When building dashboards or risk monitors, always display `lostAssets` alongside share price for V1.1+ vaults to give users a complete picture of vault health
