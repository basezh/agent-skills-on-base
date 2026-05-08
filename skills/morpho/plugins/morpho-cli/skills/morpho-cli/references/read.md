# Read Command Response Schemas

## Reading conventions

All Morpho tool responses follow these invariants. Learn them once; they apply to every tool.

1. **No envelope noise.** No `tool` or `timestamp` fields.
2. **Chain and userAddress are hoisted.** When constant across a payload they appear once at the root; nested items don't repeat them.
3. **`TokenAmount` is `{ symbol, value }`.** `value` is the decimal-applied human string (e.g. `"1000.50"` for 1000.50 USDC). There is no `decimals` field. Never multiply or divide — the value is already in the form you quote to the user.
4. **Every rate, ratio, APY, APR, fee, LTV, and utilization is a percent string with `Pct` suffix.** `"3.12"` means 3.12%. `"86"` means 86%. Never a fraction. The only exception is `healthFactor`, which is a ratio (`<1` means liquidatable).
5. **USD fields are scalar dollar strings with `Usd` suffix.** `suppliedUsd: "1234.56"` means $1,234.56. Absent when the API has no price feed.
6. **One `warnings` array per response, always at the root.** Check it before acting on the response.
7. **Single-item reads return the item directly.** `get-market` returns a `MarketDetail`, not `{ market: ... }`. `get-vault` returns a `VaultDetail` directly.
8. **List reads return `{ chain, <items>, pagination? }`.** If `pagination` is absent, you have everything.

---

## `health-check`

**Options:** _(none)_

Output:
```json
{ "status": "healthy" }
```

- `status` — `"healthy"` | `"unhealthy"`

## `get-supported-chains`

**Options:** _(none)_

Output (bare array — one entry per registered chain):
```json
[
  {
    "slug": "ethereum",
    "name": "Ethereum",
    "chainId": "1",
    "explorerUrl": "https://etherscan.io",
    "isTestnet": false
  },
  {
    "slug": "base",
    "name": "Base",
    "chainId": "8453",
    "explorerUrl": "https://basescan.org",
    "isTestnet": false
  },
  {
    "slug": "arbitrum",
    "name": "Arbitrum One",
    "chainId": "42161",
    "explorerUrl": "https://arbiscan.io",
    "isTestnet": false
  }
]
```

All 11 registered slugs: `ethereum`, `base`, `arbitrum`, `optimism`, `polygon`, `unichain`, `worldchain`, `katana`, `hyperevm`, `monad`, `stable`. The shape above applies to every entry in the array.

## `get-market`

**Options:** `--chain` (required), `--id` (required)

Output (a `MarketDetail`, returned directly):
```json
{
  "id": "0x...",
  "chain": "base",
  "loanAsset": { "address": "0x...", "symbol": "USDC" },
  "collateralAsset": { "address": "0x...", "symbol": "WETH" },
  "lltvPct": "86",
  "borrowApyPct": "3.12",
  "supplyApyPct": "2.10",
  "utilizationPct": "75",
  "totalSupply":    { "symbol": "USDC", "value": "5000000" },
  "totalBorrow":    { "symbol": "USDC", "value": "3500000" },
  "totalCollateral": { "symbol": "WETH", "value": "1500" },
  "totalLiquidity": { "symbol": "USDC", "value": "1500000" },
  "supplyAssetsUsd": "5000000.00",
  "borrowAssetsUsd": "3500000.00",
  "collateralAssetsUsd": "4200000.00",
  "liquidityAssetsUsd": "1500000.00",
  "rewards": [
    {
      "asset": { "address": "0x...", "symbol": "MORPHO" },
      "supplyAprPct": "1.20",
      "borrowAprPct": "0.50"
    }
  ]
}
```

- `lltvPct` — loan-to-value limit as percent string: `"86"` = 86%
- `utilizationPct` — market utilization as percent string: `"75"` = 75%
- `totalSupply`, `totalBorrow`, `totalLiquidity` — `TokenAmount` in loan-asset units
- `totalCollateral` — `TokenAmount` in collateral-asset units
- USD fields (`supplyAssetsUsd`, etc.) — absent when the API has no price feed
- `rewards` — optional array; each item has `supplyAprPct` (and optionally `borrowAprPct`)
- Throws `NOT_FOUND` error if market ID does not exist

## `query-markets`

**Options:** `--chain` (required), `--loan-asset` (optional), `--collateral-asset` (optional), `--sort-by` (`supplyApy`, `borrowApy`, `netSupplyApy`, `netBorrowApy`, `supplyAssetsUsd`, `borrowAssetsUsd`, `totalLiquidityUsd`; default: `supplyAssetsUsd`), `--sort-direction` (`asc`, `desc`; default: `desc`), `--limit` (1–100, default **10** — kept small because unfiltered market counts grow into the hundreds), `--skip` (offset), `--fields` (comma-separated: `supplyApy`, `borrowApy`, `totalSupply`, `totalBorrow`, `totalCollateral`, `totalLiquidity`, `supplyAssetsUsd`, `borrowAssetsUsd`, `collateralAssetsUsd`, `liquidityAssetsUsd`)

Naive listings (no `--loan-asset` / `--collateral-asset`) return the top 10 markets sorted by `supplyAssetsUsd desc`. Use `--limit` / `--skip` with the returned `pagination` metadata (always present when more results exist) to page through.

Output (`{ chain, markets, pagination? }`):
```json
{
  "chain": "base",
  "markets": [
    {
      "id": "0x...",
      "loanAsset": { "address": "0x...", "symbol": "USDC" },
      "collateralAsset": { "address": "0x...", "symbol": "WETH" },
      "lltvPct": "86",
      "borrowApyPct": "3.12",
      "supplyApyPct": "2.10",
      "utilizationPct": "75",
      "totalSupply":    { "symbol": "USDC", "value": "5000000" },
      "totalBorrow":    { "symbol": "USDC", "value": "3500000" },
      "totalCollateral": { "symbol": "WETH", "value": "1500" },
      "totalLiquidity": { "symbol": "USDC", "value": "1500000" },
      "supplyAssetsUsd": "5000000.00",
      "borrowAssetsUsd": "3500000.00",
      "collateralAssetsUsd": "4200000.00",
      "liquidityAssetsUsd": "1500000.00",
      "rewards": []
    }
  ],
  "pagination": { "total": 200, "limit": 8, "skip": 0 }
}
```

- Items are `MarketDetail` without the `chain` field (hoisted to root)
- `pagination` is absent when you have all results
- `--fields` controls which optional fields are returned; omit to get all

## `get-vault`

**Options:** `--chain` (required), `--address` (required)

Output (a `VaultDetail`, returned directly):
```json
{
  "address": "0x...",
  "chain": "base",
  "name": "Steakhouse USDC",
  "version": "v1",
  "asset": { "address": "0x...", "symbol": "USDC" },
  "curator": "Steakhouse",
  "apyPct": "5.34",
  "feePct": "10",
  "tvl": { "symbol": "USDC", "value": "125000000" },
  "tvlUsd": "125000000.00",
  "rewards": [
    {
      "asset": { "address": "0x...", "symbol": "MORPHO" },
      "supplyAprPct": "1.20"
    }
  ],
  "allocations": [
    {
      "kind": "market",
      "marketId": "0x...",
      "loanAsset": { "address": "0x...", "symbol": "USDC" },
      "collateralAsset": { "address": "0x...", "symbol": "WETH" },
      "supply": { "symbol": "USDC", "value": "50000000" },
      "supplyUsd": "50000000.00"
    }
  ]
}
```

For v2 vaults, `allocations` entries use `kind: "adapter"` instead:
```json
{
  "allocations": [
    {
      "kind": "adapter",
      "adapterAddress": "0x...",
      "supply": { "symbol": "USDC", "value": "50000000" },
      "supplyUsd": "50000000.00"
    }
  ]
}
```

- `version` — `"v1"` (MetaMorpho) or `"v2"` (new vault contract). Always present
- `type` — `"MorphoVault"` or `"FeeWrapper"` (v2 only; absent for v1)
- `tvl` — `TokenAmount` in vault asset units
- `feePct` — for v1 this is the performance fee; for v2 it is `performanceFee + managementFee`
- `allocations` — optional; `kind: "market"` for v1 allocations, `kind: "adapter"` for v2
- `supplyUsd` on allocations — absent when the API has no price feed
- Throws `NOT_FOUND` error if vault address does not exist

## `query-vaults`

**Options:** `--chain` (required), `--asset-symbol`, `--asset-address`, `--sort` (`apy_desc`, `apy_asc`, `tvl_desc`, `tvl_asc`), `--limit` (1–100, default 100), `--skip` (offset), `--fields` (comma-separated: `address`, `name`, `symbol`, `apyPct`, `tvl`, `tvlUsd`, `feePct`)

Output (`{ chain, vaults, pagination? }`):
```json
{
  "chain": "base",
  "vaults": [
    {
      "address": "0x...",
      "name": "Steakhouse USDC",
      "version": "v1",
      "asset": { "address": "0x...", "symbol": "USDC" },
      "apyPct": "5.34",
      "tvl": { "symbol": "USDC", "value": "125000000" },
      "tvlUsd": "125000000.00",
      "feePct": "10",
      "type": "MorphoVault",
      "rewards": [
        {
          "asset": { "address": "0x...", "symbol": "MORPHO" },
          "supplyAprPct": "1.20"
        }
      ]
    }
  ],
  "pagination": { "total": 50, "limit": 12, "skip": 0 }
}
```

- Items are `VaultDetail` without the `chain` field (hoisted to root)
- Results include both v1 and v2 vaults merged and sorted together
- `pagination` is absent when you have all results
- `--fields` controls which optional fields are returned; omit to get all
- `--sort` and `--skip` enable server-side sorting and pagination

## `get-positions`

**Options:** `--chain` (required), `--user-address` (required)

Returns all Morpho positions for a user on a chain. Zero-balance positions are filtered out. No pagination — the full portfolio is returned in one call.

Output (`{ chain, userAddress, totals, vaultPositions, marketPositions }`):
```json
{
  "chain": "base",
  "userAddress": "0x...",
  "totals": {
    "vaultCount": 2,
    "marketCount": 1,
    "suppliedUsd": "15007.52",
    "borrowedUsd": "500.50",
    "collateralUsd": "4200.00",
    "netWorthUsd": "18707.02"
  },
  "vaultPositions": [
    {
      "vault": {
        "address": "0x...",
        "name": "Steakhouse USDC",
        "asset": { "address": "0x...", "symbol": "USDC" },
        "version": "v1"
      },
      "supplied": { "symbol": "USDC", "value": "10000" },
      "suppliedUsd": "10005.42"
    },
    {
      "vault": {
        "address": "0x...",
        "name": "Gauntlet v2",
        "asset": { "address": "0x...", "symbol": "USDC" },
        "version": "v2"
      },
      "supplied": { "symbol": "USDC", "value": "5000" },
      "suppliedUsd": "5002.10"
    }
  ],
  "marketPositions": [
    {
      "market": {
        "id": "0x8793cf...",
        "loanAsset": { "address": "0x...", "symbol": "USDC" },
        "collateralAsset": { "address": "0x...", "symbol": "WETH" },
        "lltvPct": "86"
      },
      "supplied": { "symbol": "USDC", "value": "0" },
      "borrowed": { "symbol": "USDC", "value": "500" },
      "collateral": { "symbol": "WETH", "value": "1" },
      "borrowedUsd": "500.50",
      "collateralUsd": "4200.00",
      "healthFactor": "2.34"
    }
  ]
}
```

- `chain` and `userAddress` are at the root; nested vault/market objects omit them
- `vault.version` on each vault position is `"v1"` or `"v2"`. Filter client-side if needed
- `totals` — always has `vaultCount` and `marketCount`. The four USD fields are omitted when any nonzero contributor lacks a price feed. `netWorthUsd = suppliedUsd + collateralUsd - borrowedUsd`
- `suppliedUsd` / `borrowedUsd` / `collateralUsd` on positions — absent when no price feed
- `healthFactor` on market positions — omitted when there is no borrow; `< 1.0` is liquidatable
- `supplied`, `borrowed`, `collateral` on market positions — always present, default `"0"`
- Both arrays are always present; empty when no positions

## `get-token-balance`

**Options:** `--chain` (required), `--user-address` (required), `--token-address` (required)

Output:
```json
{
  "chain": "base",
  "userAddress": "0x...",
  "asset": { "address": "0x...", "symbol": "USDC" },
  "balance": { "symbol": "USDC", "value": "1000.00" },
  "morphoAllowance": { "symbol": "USDC", "value": "0" },
  "bundlerAllowance": { "symbol": "USDC", "value": "0" },
  "permit2Allowance": { "symbol": "USDC", "value": "115792089237316195423570985008687907853269984665640564039457584007913129639935" },
  "needsApprovalForMorpho": true,
  "needsApprovalForBundler": true
}
```

- `balance`, `morphoAllowance`, `bundlerAllowance`, `permit2Allowance` — all `TokenAmount` (`{ symbol, value }`). Values are already decimal-applied — do not divide again
- `needsApprovalForMorpho` — true when the user needs to approve Morpho Blue to spend this token
- `needsApprovalForBundler` — true when the user needs to approve the Morpho Bundler
- No raw integer strings, no decimals field — all amounts are human-readable
