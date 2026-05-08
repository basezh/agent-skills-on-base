---
name: morpho-builder
description: Use when building applications, bots, SDKs, or integrations against the Morpho lending protocol — deposits, borrows, repays, withdrawals, vault v1/v2 integrations, V1→V2 migration flows, risk monitors, portfolio dashboards. Steers toward `@morpho-org/morpho-sdk` (`MorphoClient`) for user-facing transactions and flags uncovered flows (curator ops, market creation, liquidations, flashloans, rewards) that need lower-level SDKs. Invoke whenever a user mentions Morpho, MetaMorpho, Morpho Blue, or any on-chain integration touching these contracts — even if they don't name morpho-sdk explicitly.
---

# Morpho Builder Skill

> **Experimental (pre-v1.0)** — SDK recommendations, API schemas, and best practices may evolve as the protocol tooling matures.

Reference guide for building applications that integrate with the Morpho lending protocol. For operating on the protocol directly in a conversation, use the morpho-cli skill instead.

> **Prefer Morpho v2.** The Morpho Optimizer (Morpho-Aave, Morpho-Compound) is deprecated. For new vault deployments, prefer vault v2 over MetaMorpho (vault v1). Note: the two vault versions have **incompatible ABIs** — use `vaultV2Abi` for v2 vaults and `metaMorphoAbi` for v1 vaults. Match the ABI to the on-chain contract.

## Protocol Overview

**Morpho Blue** — isolated lending markets. Each market is defined by five parameters: loan token, collateral token, oracle, interest rate model (IRM), and liquidation LTV (LLTV). Markets are identified by a `MarketId` (hash of these parameters).

**Morpho Vaults v2** — the newer vault contract. ERC-4626 compliant. Allocates deposits across multiple markets via adapters, which can wrap MetaMorpho (v1) vaults and Morpho Blue markets. Preferred for new vault deployments. In the SDK: `vaultV2Abi`, `VaultV2`, `fetchVaultV2`.

**MetaMorpho (vault v1)** — the original vault contract. Still functional and widely deployed on-chain. In the SDK: `metaMorphoAbi`, `Vault`, `fetchVault`. The two vault versions have incompatible ABIs — use the correct one for the contract you're interacting with.

**Singleton contract**: `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb` — same address on Ethereum (chain 1) and Base (chain 8453) via CREATE2.

### Key Entities

| Entity | Identifier | Description |
|--------|-----------|-------------|
| Market | `MarketId` | Isolated lending pool with specific collateral/loan pair |
| Vault | `Address` | Multi-market aggregator, ERC-4626. Two versions: v2 (`VaultV2`) and MetaMorpho v1 (`Vault`) — ABIs differ |
| Position | User + Market/Vault | User's supply/borrow in a market or deposit in a vault |
| Token | `Address` + `decimals` | ERC-20 — decimals vary (USDC/USDT = 6, WETH/DAI = 18) |

### Key Quantities

| Quantity | Format | Notes |
|----------|--------|-------|
| APY | Decimal (`0.0534` = 5.34%) | From GraphQL `state.netApy` |
| LLTV | Raw 1e18 (`860000000000000000` = 86%) | From SDK or API |
| Token amounts | Raw units | Divide by 10^decimals for human-readable. Use `parseUnits`/`formatUnits` from viem |
| Health factor | Ratio | ≥ 1.0 = safe, < 1.0 = liquidatable |

## SDK Selection

**Default to `@morpho-org/morpho-sdk` for user-facing flows.** It is the high-level abstraction layer that wraps `blue-sdk`, `blue-sdk-viem`, `bundler-sdk-viem`, and `simulation-sdk`, and handles bundler-vs-direct routing, slippage bounds, LLTV-buffer health checks on borrows, ERC-20 approvals / EIP-2612 permits / Permit2 / Morpho `setAuthorization` requirements, and native-token wrapping — all internally. Hand-rolling these from the lower-level SDKs is error-prone and duplicates logic morpho-sdk already gets right.

**Use morpho-sdk for:** vault deposits / withdrawals / redeems (V1 and V2), VaultV2 force-withdraw / force-redeem, V1→V2 migration, Morpho Blue `supplyCollateral`, `borrow` (with optional PublicAllocator reallocations), atomic `supplyCollateralBorrow`, `repay` (by assets or shares), `withdrawCollateral`, atomic `repayWithdrawCollateral`, and per-entity reads (`getData`, `getMarketData`, `getPositionData`).

**Drop to lower-level SDKs only for:**

- Curator / allocator / owner ops on vaults (setCap, reallocate, role management, timelocks, guardian/sentinel flows)
- Morpho Blue market **creation**
- **Liquidations**, **flashloans**, **pre-liquidation**, **rewards claiming**
- Custom bundler compositions beyond the actions listed above
- Portfolio-wide aggregation across many markets / vaults (morpho-sdk exposes per-entity reads only — use `blue-sdk-viem` fetch helpers or the GraphQL API)

**React / wagmi apps:** there is no `@morpho-org/morpho-sdk-wagmi` package. Use `@morpho-org/blue-sdk-wagmi` hooks for reads, instantiate `MorphoClient` against the wagmi public client for writes, and pass the `buildTx` output to wagmi's `useSendTransaction`.

## SDK Registry

All packages are published under `@morpho-org` on npm.

| Package | Purpose |
|---------|---------|
| `@morpho-org/morpho-sdk` | **Start here.** High-level abstraction wrapping the four SDKs below. Builds user-facing transactions (deposit, borrow, repay, withdraw, migrate) with slippage, approvals, permits, and bundler routing handled internally |
| `@morpho-org/blue-sdk` | Core types, entity classes (`Market`, `Vault`, `VaultV2`, `Position`, `MarketParams`), and constants. _Used internally by morpho-sdk; use directly only for type imports or uncovered flows_ |
| `@morpho-org/blue-sdk-viem` | Viem augmentation — ABIs, fetch helpers (`fetchMarket`, `fetchVault`, `fetchVaultV2`, `fetchPosition`). _Used internally by morpho-sdk; use directly for ABIs, multi-entity reads, or uncovered write flows_ |
| `@morpho-org/bundler-sdk-viem` | Multi-step transaction bundling (approvals, transfers, Morpho ops in one tx). _Used internally by morpho-sdk; use directly only for custom compositions beyond morpho-sdk's action set_ |
| `@morpho-org/simulation-sdk` | Framework-agnostic simulation of Morpho operations. _Used internally by morpho-sdk; use directly only for standalone what-if simulations_ |
| `@morpho-org/blue-sdk-ethers` | Ethers augmentation — same fetch helpers as viem, for Ethers-based projects |
| `@morpho-org/blue-sdk-wagmi` | React hooks (`useMarket`, `useVault`, `usePosition`, etc.) wrapping core SDK. Requires wagmi v2. Pair with morpho-sdk for writes |
| `@morpho-org/blue-api-sdk` | GraphQL SDK with typed queries for the Morpho API |
| `@morpho-org/simulation-sdk-wagmi` | React hooks for client-side simulation (`useSimulationState`) |
| `@morpho-org/liquidity-sdk-viem` | Liquidity monitoring and bot infrastructure |
| `@morpho-org/liquidation-sdk-viem` | Liquidation bot infrastructure |
| `@morpho-org/migration-sdk-viem` | Migration from Aave/Compound to Morpho |
| `@morpho-org/morpho-ts` | Time and format utilities |
| `@morpho-org/test` | Vitest/Anvil test fixtures for Morpho |
| `@morpho-org/test-wagmi` | Wagmi test config extension of `@morpho-org/test` |
| `@morpho-org/morpho-test` | Framework-agnostic test fixtures |

## SDK Details

### `@morpho-org/morpho-sdk`

High-level abstraction. Default entry point for user-facing flows.

**Construction** — two equivalent forms: `new MorphoClient(publicClient)` returns a direct client, or `publicClient.extend(morphoViemExtension())` attaches the API to a viem public client under `.morpho`.

**Entity factories** — all require a `chainId` (`1` for Ethereum, `8453` for Base):

| Factory | Returns | Use for |
|---------|---------|---------|
| `morpho.vaultV2(address, chainId)` | `MorphoVaultV2` | Vault V2 (preferred for new deployments) |
| `morpho.vaultV1(address, chainId)` | `MorphoVaultV1` | MetaMorpho (vault v1) |
| `morpho.marketV1(marketParams, chainId)` | `MorphoMarketV1` | Morpho Blue market |

**Reads** — each entity exposes `getData()`, plus `getMarketData()` / `getPositionData(user)` where applicable. Returns live on-chain state needed to build actions.

**Actions** — each action returns `{ buildTx, getRequirements }`:

| Entity | Actions |
|--------|---------|
| `MorphoVaultV2` | `deposit`, `withdraw`, `redeem`, `forceWithdraw`, `forceRedeem` |
| `MorphoVaultV1` | `deposit`, `withdraw`, `redeem`, `migrateToV2` |
| `MorphoMarketV1` | `supplyCollateral`, `borrow`, `repay`, `withdrawCollateral`, `supplyCollateralBorrow`, `repayWithdrawCollateral`, plus `getReallocationData` / `getReallocations` for PublicAllocator |

**Canonical write pattern:**

1. Construct `MorphoClient` and the entity (vault or market).
2. Fetch live state: `await entity.getData()` (vaults) or `await market.getMarketData()` + `await market.getPositionData(user)` (markets).
3. Call the action: `const { buildTx, getRequirements } = await entity.deposit({ amount, userAddress, accrualVault })`.
4. Resolve requirements: `const reqs = await getRequirements()` — returns ERC-20 approvals, EIP-2612 permits, Permit2 data, and/or `morpho.setAuthorization(GA1, true)` steps as needed.
5. Sign permits / send approval txs as dictated by the requirements.
6. Build and send: `const tx = buildTx(requirementSignatures)` → `{ to, value, data, action }` → sign and broadcast.

**Notes:**

- **Slippage** — morpho-sdk computes `maxSharePrice` / `minSharePrice` bounds from on-chain state automatically. Default tolerance is 3 bps, capped at 10%. Override via the action's slippage option when tighter/looser bounds are needed.
- **Borrow health** — `borrow` and `supplyCollateralBorrow` apply an LLTV buffer automatically using the position snapshot you pass in. Always fetch a fresh `positionData` immediately before calling borrow actions.
- **Native ETH** — pass a `nativeAmount` to deposit/borrow actions for atomic wrap-and-supply in a single transaction.
- **Analytics** — an optional `metadata` field on every action tags the transaction for attribution.
- **No wagmi wrapper** — morpho-sdk is viem-only. In React, construct `MorphoClient` against the wagmi public client (`usePublicClient()`) and feed `buildTx` output into `useSendTransaction`.

### `@morpho-org/blue-sdk`

Types, entity classes, and constants.

- **`Market`** — class with operation methods (`.supply()`, `.borrow()`, `.repay()`, `.withdraw()`) and conversion methods (`.toSupplyAssets()`, `.toBorrowAssets()`)
- **`MarketParams`** — `new MarketParams({ loanToken, collateralToken, oracle, irm, lltv })`
- **`MarketId`** — branded type identifying a market
- **`Position`** — `new Position({ supplyShares, borrowShares, collateral })`
- **`VaultV2`** — vault v2 entity class (preferred for new integrations)
- **`Vault`** — MetaMorpho (vault v1) entity class
- **`VaultConfig`** — configuration class for MetaMorpho vaults

### `@morpho-org/blue-sdk-viem`

ABIs, fetch helpers, and viem augmentation.

**ABI catalog** — import these instead of hand-rolling ABI JSON:

| Export | Contract |
|--------|----------|
| `blueAbi` | Morpho Blue singleton |
| `vaultV2Abi` | Vault v2 (preferred for new deployments) |
| `vaultV2FactoryAbi` | Vault v2 factory |
| `metaMorphoAbi` | MetaMorpho / vault v1 (use for existing v1 vaults) |
| `metaMorphoFactoryAbi` | MetaMorpho factory / vault v1 |
| `erc2612Abi` | ERC-2612 permit |
| `permit2Abi` | Uniswap Permit2 |
| `wstEthAbi` | Wrapped stETH |
| `adaptiveCurveIrmAbi` | Morpho's adaptive curve IRM |
| `blueOracleAbi` | Morpho oracle |

**Fetch helpers** — `fetchMarket`, `fetchVaultV2` (v2) / `fetchVault` (v1), `fetchPosition` read on-chain state into SDK entity objects. Use the fetch helper matching the on-chain vault version. Entity methods include `market.toSupplyAssets()`, `vault.toShares()`, etc.

### `@morpho-org/blue-sdk-wagmi`

React hooks wrapping the core SDK. Requires wagmi v2.

Hooks: `useMarket`, `useVault`, `usePosition`, `useToken`, `useHolding`, `useMarkets`, `useVaults`, `usePositions`, `useTokens`, `useHoldings`, `useVaultMarketConfig`, `useVaultMarketConfigs`, `useVaultUser`, `useVaultUsers`, `useMarketParams`, plus plural variants.

### `@morpho-org/simulation-sdk` + `@morpho-org/simulation-sdk-wagmi`

Client-side simulation of Morpho operations. `useSimulationState` hook provides simulated post-state for UI previews without submitting transactions.

## GraphQL API

Endpoint: `https://api.morpho.org/graphql`

Key queries: `vaults` (fields: address, name, symbol, asset, state.netApy, state.totalAssets) and `markets` (fields: uniqueKey, loanAsset, collateralAsset, state.supplyApy, state.borrowApy, state.utilization, lltv).

### Filters and Pagination

| Filter | Example | Notes |
|--------|---------|-------|
| `chainId_in` | `[1]`, `[8453]`, `[1, 8453]` | Required — always specify chain |
| `assetSymbol_in` | `["USDC"]` | Filter by asset symbol |
| `address_in` | `["0x..."]` | Filter by vault address |
| `uniqueKey_in` | `["0x..."]` | Filter by market ID |
| `userAddress_in` | `["0x..."]` | Filter positions for a user |

Paginate with `first` and `skip`. Iterate until `items.length < first`.

### Value Interpretation

| Field | Format | Conversion |
|-------|--------|------------|
| `netApy` / `supplyApy` / `borrowApy` | Decimal | `0.0534` = 5.34% |
| `totalAssets` | Raw string | Divide by 10^`asset.decimals` |
| `lltv` | Raw 1e18 string | Divide by 1e18 for percentage |

## Integration Approaches

- **Backend / scripts / bots (viem)** — default to `MorphoClient(publicClient)` from `@morpho-org/morpho-sdk`. Use `@morpho-org/blue-sdk-viem` fetch helpers + ABIs directly only for reads across many entities or for actions morpho-sdk doesn't expose.
- **Frontend (React + wagmi)** — use `@morpho-org/blue-sdk-wagmi` hooks (`useVault`, `usePosition`, etc.) for reactive reads. For writes, construct `MorphoClient` against `usePublicClient()`, build the transaction with morpho-sdk, and submit via wagmi's `useSendTransaction`. There is no `@morpho-org/morpho-sdk-wagmi`.
- **Advanced (curator ops, market creation, liquidations, flashloans, rewards)** — morpho-sdk does not cover these. Use `@morpho-org/blue-sdk-viem` ABIs together with the targeted sub-SDKs: `@morpho-org/liquidation-sdk-viem`, `@morpho-org/liquidity-sdk-viem`, or `@morpho-org/migration-sdk-viem`.

## Protocol Mechanics

### Dead Deposits (Inflation Attack Protection)

[Detailed reference](references/dead-deposits.md)

ERC-4626 vaults are vulnerable to share-price inflation attacks on their first deposit. A **dead deposit** — minting shares to the burn address `0x000000000000000000000000000000000000dEaD` — must be the very first transaction on any new vault or market. Any user deposit before this enables the attack.

**Vault V2** — target shares depend on the asset's decimals:

Formula: `targetShares = max(1e9, 10^(6 + max(0, 18 - decimals)))` — 18-dec assets: 1e9, 8-dec: 1e16, 6-dec: 1e18. Call `vault.mint(TARGET_SHARES, 0xdead)`.

**Market V1** — fixed `1e9` shares regardless of decimals. Call `morpho.supply(marketParams, 0, 1e9, 0xdead, "")`.

**Vault V1** — `1e9` shares standard; use `1e12` for tokens with fewer than 9 decimals.

**Active-cap requirement**: When a Vault V2 references underlying markets/vaults, `0xdead` must also hold:
- `1e9` supplyShares in each **Market V1** with non-zero vault caps
- `1e9` shares in each **Vault V1** with non-zero caps or present in withdraw queues

### AdaptiveCurveIRM

[Detailed reference](references/adaptive-curve-irm.md)

Morpho's approved IRM uses a two-pronged mechanism:
1. **Curve** — instantly adjusts rates when utilization changes (e.g., 90% ↔ 0% scales rate ×4 or ÷4)
2. **Adaptive** — continuously shifts the target rate over time based on sustained utilization

| Utilization | Rate behavior |
|-------------|---------------|
| 0% | Halves every ~5 days |
| 90% (target) | Stable |
| 100% | Doubles every ~5 days |

**Operational warnings**: Avoid 100% utilization — rates compound aggressively. Seed markets with initial supply immediately after creation; an empty market at 0% utilization triggers automatic rate decay.

### Slippage and Share/Asset Conversion

[Detailed reference](references/slippage.md)

The exchange rate between assets and shares can shift between transaction preparation and on-chain execution. With a proper dead deposit this is a UX concern, not a security vulnerability, but integrations should still protect users.

**Defensive pattern:** When using `@morpho-org/morpho-sdk`, slippage bounds (`maxSharePrice` / `minSharePrice`, default 3 bps, capped at 10%) are computed and applied automatically — no manual preview+tolerance wiring is needed. Only when dropping to `blue-sdk-viem` / `bundler-sdk-viem` directly should you hand-roll the pattern: call `previewDeposit()` to estimate shares, apply a tolerance floor (e.g., 1%), and verify the actual result meets the minimum.

**Full withdrawals**: Use `redeem()`, not `withdraw()` — avoids leaving dust behind.

**Vault V2 quirk**: `maxDeposit`, `maxMint`, `maxWithdraw`, and `maxRedeem` always return zero. Do not rely on these for capacity checks.

### Bad Debt Tracking

[Detailed reference](references/bad-debt.md)

- **V1.0**: Realized immediately — share price drops atomically for all suppliers in the affected market. Vulnerable to flash-loan amplification of bad debt realization.
- **V1.1+**: Tracked via `lostAssets` field — share price is unaffected until explicit realization. Prevents flash-loan manipulation.

### Common Pitfalls

[Detailed reference](references/common-pitfalls.md)

| Pitfall | Consequence | Prevention |
|---------|-------------|------------|
| Missing dead deposit | Inflation attack / share-price manipulation | Seed shares to `0xdead` before any user deposit |
| `withdraw()` for full exit | Dust remains in position | Use `redeem()` for full exits |
| Oracle risk blindness | Liquidations with stale or manipulated prices | Check oracle type, freshness, and known risks before integrating a market |
| ERC4626 vault as collateral | Share-price manipulation (Cream-hack style) | Avoid V1.0 vaults as collateral; V1.1+ without bad debt realization are safer |
| ERC4626 vault as loan asset | Unpredictable liquidation incentives | Do not list any ERC4626 vault as a loan asset |
| Ignoring vault governance | Owner/curator can reallocate to risky markets | Audit role holders; document trust assumptions to users |

## Safety Notes

**Addresses**: Discover via GraphQL API or SDK fetch helpers. Present candidates to the user for confirmation before use. Never hardcode vault, market, or token addresses.

**Chain**: Always parameterize — accept chain as a function parameter. Never assume Ethereum or Base. Morpho is deployed on both chains at the same singleton address.

**Write flow**: All write operations follow: **query → prepare → simulate → confirm → execute**. Simulate transactions before execution to catch reverts early. The server returns unsigned transactions — your app handles signing.

**Token decimals**: USDC/USDT = 6, WETH/DAI = 18. Read `decimals` from the API or contract — never assume 18. Use `parseUnits(amount, decimals)` for conversion.

**USDT approval quirk**: Must reset allowance to 0 before setting a new value. Implement as a conditional check for USDT or as a general reset-before-set pattern.

**DAI permit**: Non-standard — use ERC-20 `approve()` instead of EIP-2612 permit.

**Health factor**: For borrow operations, validate the health factor after the intended borrow. Prevent proceeding if the position would become unsafe (health factor < 1.0). Warn at ~1.1.

**Dead deposits**: Any vault or market creation must include the dead deposit as the first transaction. See *Protocol Mechanics > Dead Deposits* above.

## Testing

[Detailed reference](references/testing-guide.md)

- **`@morpho-org/test`** — Vitest/Anvil fixtures for Morpho-specific test setup.
- See the [testing guide](references/testing-guide.md) for a full catalog of test cases covering vaults, markets, input validation, health factors, token approvals, signature security, and bad debt. Implementations should include these checks in their test suites.

## Best Practices

**Prefer `@morpho-org/morpho-sdk` for user-facing flows**: `MorphoClient` centralizes slippage bounds, approvals / permits / Permit2 / GA1 authorization, LLTV-buffer health checks on borrow, and bundler routing. Only hand-roll these via `@morpho-org/blue-sdk-viem` + `@morpho-org/bundler-sdk-viem` when morpho-sdk does not expose the action (curator ops, market creation, liquidations, flashloans, rewards, custom bundler compositions). See *SDK Selection* above for the full coverage list.

**Prefer vault v2 for new deployments**: When creating new vaults, prefer vault v2 over MetaMorpho (v1). When interacting with existing vaults, match the ABI to the on-chain contract — `vaultV2Abi` for v2, `metaMorphoAbi` for v1. They are not interchangeable.

**Prefer Morpho Blue over Morpho Optimizer**: The original Morpho Optimizer (Morpho-Aave, Morpho-Compound) is deprecated. Prefer Morpho Blue contracts and SDKs for new integrations.

**No Bundler3**: Deprecated. Do not reference in new code.

**ABIs**: Always import from `@morpho-org/blue-sdk-viem`. Never hand-roll ABI JSON.

## Post-Implementation Review

After finishing code or a plan, review it against these Morpho-specific checks before presenting the result. For each, mark CRITICAL (fund loss), WARNING (broken UX), or N/A.

1. **SDK Choice** — standard user-facing flows (deposit, borrow, repay, withdraw, migrate, supply/withdraw collateral) use `@morpho-org/morpho-sdk` (`MorphoClient`) rather than hand-rolled `blue-sdk-viem` + `bundler-sdk-viem` + `simulation-sdk` compositions. CRITICAL if the hand-rolled version skips a safeguard morpho-sdk would have applied (slippage bound, LLTV buffer on borrow, USDT allowance reset, GA1 authorization); WARNING if it is merely redundant re-implementation of covered flows.
2. **Dead Deposit Protection** — vault/market creation includes dead deposit to `0xdead` as the first tx; correct formula per version ([reference](references/dead-deposits.md))
3. **Slippage Protection** — morpho-sdk handles tolerance automatically; when using lower-level SDKs directly, deposits/withdrawals use preview functions + tolerance check; full exits use `redeem()` not `withdraw()`; no reliance on Vault V2 `max*` functions ([reference](references/slippage.md))
4. **IRM Awareness** — new markets seeded promptly; no sustained 100% utilization; APY formulas correct ([reference](references/adaptive-curve-irm.md))
5. **Bad Debt Safety** — no V1.0 vault as collateral; no ERC4626 vault as loan asset; dashboards surface `lostAssets` ([reference](references/bad-debt.md))
6. **Token Approvals** — USDT resets allowance to 0 first; DAI uses `approve()` not `permit()` (morpho-sdk handles both automatically via its requirements flow; hand-rolled integrations must implement these) ([reference](references/common-pitfalls.md))
7. **Vault Governance** — UI surfaces role holders; trust assumptions documented ([reference](references/common-pitfalls.md))
8. **General Safety** — no hardcoded addresses; chain ID parameterized; decimals read not assumed; write ops simulate before execute; health factor validated; ABIs from `@morpho-org/blue-sdk-viem`
9. **Test Coverage** — implementation includes tests for relevant cases from the [testing guide](references/testing-guide.md); edge cases (dead deposits, USDT approvals, health factor boundaries, full withdrawals via `redeem()`) are covered
