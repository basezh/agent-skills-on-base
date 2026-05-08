---
name: morpho-cli
description: Drive the Morpho lending protocol from the terminal via `npx @morpho-org/cli@latest` — queries vaults/markets/positions and prepares unsigned Morpho transactions with built-in simulation across all supported chains (Ethereum, Base, Arbitrum, Optimism, Polygon, Unichain, World Chain, Katana, HyperEVM, Monad, Stable). Invoke whenever the user asks to explore Morpho vault APYs / TVL / allocations ("best USDC vault on Base"), compare Morpho Blue markets ("ETH/USDC markets on Arbitrum"), inspect positions or health factor ("what are my Morpho positions"), or prepare any Morpho operation — deposit, withdraw, supply, borrow, repay, supply/withdraw collateral — even when the user doesn't explicitly name the CLI. If the user is writing application code that integrates Morpho, prefer the morpho-builder skill instead.
---

# morpho-cli

> **Experimental (pre-v1.0)** — Command syntax, response schemas, and available operations may change. Always verify critical outputs independently.

Query Morpho protocol data and build unsigned transactions. All commands output JSON to stdout. No private keys needed.

```bash
npx @morpho-org/cli@latest <command> [options]
```

Supported chains: `ethereum`, `base`, `arbitrum`, `optimism`, `polygon`, `unichain`, `worldchain`, `katana`, `hyperevm`, `monad`, `stable`. Every command requires `--chain`.

## Response Schemas

- **[Read commands](references/read.md)** — exact JSON shapes for query-vaults, get-vault, query-markets, get-market, get-positions, get-token-balance, health-check, get-supported-chains
- **[Write commands](references/write.md)** — exact JSON shapes for prepare-\* and simulate-transactions

## Quick Reference

```bash
# Read — query protocol state
npx @morpho-org/cli@latest query-vaults    --chain base [--asset-symbol USDC] [--asset-address 0x...] [--sort apy_desc|apy_asc|tvl_desc|tvl_asc] [--limit 5] [--skip 0] [--fields address,name,symbol,apyPct,tvl,tvlUsd,feePct]
npx @morpho-org/cli@latest get-vault       --chain base --address 0x...
npx @morpho-org/cli@latest query-markets   --chain base [--loan-asset 0x...] [--collateral-asset 0x...] [--sort-by supplyApy|borrowApy|netSupplyApy|netBorrowApy|supplyAssetsUsd|borrowAssetsUsd|totalLiquidityUsd] [--sort-direction asc|desc] [--limit 10] [--skip 0] [--fields supplyApy,borrowApy,totalSupply,totalBorrow,totalCollateral,totalLiquidity,supplyAssetsUsd,borrowAssetsUsd,collateralAssetsUsd,liquidityAssetsUsd]
npx @morpho-org/cli@latest get-market      --chain base --id 0x...
npx @morpho-org/cli@latest get-positions   --chain base --user-address 0x...
npx @morpho-org/cli@latest get-token-balance --chain base --user-address 0x... --token-address 0x...

# Write — prepare unsigned transactions (simulation runs by default; add --no-simulate to skip)
npx @morpho-org/cli@latest prepare-deposit              --chain base --vault-address 0x... --user-address 0x... --amount 1000
npx @morpho-org/cli@latest prepare-withdraw             --chain base --vault-address 0x... --user-address 0x... --amount max
npx @morpho-org/cli@latest prepare-supply               --chain base --market-id 0x... --user-address 0x... --amount 5000
npx @morpho-org/cli@latest prepare-borrow               --chain base --market-id 0x... --user-address 0x... --borrow-amount 1
npx @morpho-org/cli@latest prepare-repay                --chain base --market-id 0x... --user-address 0x... --amount max
npx @morpho-org/cli@latest prepare-supply-collateral    --chain base --market-id 0x... --user-address 0x... --amount 5000
npx @morpho-org/cli@latest prepare-withdraw-collateral  --chain base --market-id 0x... --user-address 0x... --amount max

# Simulate — standalone re-simulation or arbitrary transaction simulation
npx @morpho-org/cli@latest simulate-transactions --chain base --from 0x... --transactions '<JSON>' --analysis-context '<JSON>'

# Utility
npx @morpho-org/cli@latest health-check
npx @morpho-org/cli@latest get-supported-chains
```

## Write Workflow: Prepare → Present

Every write operation follows two steps. Simulation runs automatically inside `prepare-*`.

1. **Prepare** — run a `prepare-*` command. The CLI handles token decimals, allowances, approvals, and simulation automatically. Returns a flat `PreparedOperation` with the fields you need at the root: `operation`, `summary`, `requirements` (informational — approval txs are already in `transactions`), `transactions` (the unsigned payloads to sign), `simulated`, `simulationOk`, `totalGasUsed`, `outcome`, `warnings`. Pass `--no-simulate` to skip simulation (in which case `simulationOk`, `totalGasUsed`, and most of `outcome` will be absent).
2. **Present** — show `summary`, the `transactions` list, the key `outcome` fields (see table below), and any `warnings` in tabular format. If `simulationOk` is `false`, inspect `revertReason` before presenting.

The `outcome` block is discriminated by operation type:

| Operation | `outcome` shape | Key fields to surface |
|-----------|-----------------|------------------------|
| `deposit`, `withdraw` (vaults) | `outcome.vault` | `sharesReceived`, `assetsReceived`, `positionAssets`, `positionShares` |
| `supply`, `borrow`, `repay`, `supply_collateral`, `withdraw_collateral` (markets) | `outcome.market` | `healthFactor`, `isHealthy`, `maxBorrowable`, `utilizationBeforePct` → `utilizationAfterPct`, `borrowApyBeforePct` → `borrowApyAfterPct`, plus post-operation `supplied` / `borrowed` / `collateral` (raw integer strings — divide by 10^decimals) |

Use `simulate-transactions` separately only for re-simulating with different parameters or simulating arbitrary transactions. Its top-level success field is `allSucceeded` (not `simulationOk`) — see [references/write.md](references/write.md).


## Simulation Failures

| Revert | Cause | What to do |
|--------|-------|------------|
| `ERC20: insufficient allowance` | Missing approval | Re-prepare — CLI should include approvals automatically |
| `ERC4626ExceededMaxWithdraw` | Vault liquidity insufficient | Reduce amount (see below) |
| `insufficient balance` | User lacks tokens | Tell the user |
| Custom error hex | Protocol-specific | Query state with `get-market` or `get-vault` to diagnose |

## Partial Withdrawal

When `prepare-withdraw --amount max` cannot withdraw the full balance, the CLI returns a `PreparedOperation` whose `warnings[]` calls out the liquidity shortfall. The response is still valid — it represents the largest withdrawable amount right now.

1. **Surface the warning** to the user verbatim — do not silently accept a smaller withdrawal.
2. **Offer two paths**:
   - Accept the partial amount the CLI prepared (inspect `outcome.vault.assetsReceived` for the concrete figure, optionally re-run `prepare-withdraw` with `--amount <value>` using ~99% of that figure as a safety buffer against interest accrual between prepare and execute).
   - Wait for more liquidity — locked assets unlock as underlying-market borrowers repay or the curator reallocates.
3. **Never invent an amount** by parsing the `summary` string — it is a human sentence, not a machine-readable field.

## Safety Rules

1. **Check simulation before presenting** — simulation runs by default; check `simulationOk` (for `prepare-*`) or `allSucceeded` (for `simulate-transactions`) before presenting
2. **Never sign or broadcast** — unsigned payloads only
3. **Watch health factor** for borrows — warn if below 1.1
4. **Communicate liquidity constraints** clearly for partial withdrawals

## CLI Errors

When a `npx @morpho-org/cli@latest` command fails, **stop and report the error to the user**. Do not:
- Retry with different parameters you invented
- Fall back to alternative tools or APIs
- Attempt to work around missing required options
- Pipe output through `jq` or other filters — use the CLI's built-in flags (`--fields`, `--sort-by`, `--limit`, etc.) to shape the response


## Common Mistakes

- Forgetting `--chain` — every command requires it, there is no default
- Using chain IDs (`1`, `8453`) instead of names (`ethereum`, `base`)
- Dividing `TokenAmount.value` by `10^decimals` — `TokenAmount` values are already decimal-applied (a USDC value of `"1000"` means $1,000, not 1,000 micro-USDC). `*Pct` fields are already percent-scaled; `*Usd` fields are already in dollars. The only raw integer strings are inside `outcome.market.{supplied,borrowed,collateral}` and `outcome.vault.{sharesReceived,assetsReceived,positionShares}` — those do need `/10^decimals` for display.
- Assuming 18 decimals — USDC/USDT have 6, WBTC/cbBTC have 8. Read decimals from response metadata; never assume.
- Passing raw units as `--amount` — CLI expects human-readable (`1000` not `1000000000`)
- Using `--no-simulate` without reason — simulation is on by default; only skip when debugging or for speed
- Ignoring `simulationOk === false` on `prepare-*` (or `allSucceeded === false` on `simulate-transactions`) — diagnose before presenting
