# Write Command Response Schemas

## Write response shape

All `prepare-*` commands return a `PreparedOperation` directly (no wrapper envelope). Simulation runs by default; pass `--no-simulate` to skip.

```json
{
  "operation": "deposit",
  "chain": "base",
  "summary": "Deposit 1000 USDC into Steakhouse USDC",
  "requirements": [
    { "type": "approval", "token": "0x...", "spender": "0x...", "amount": "1000000000" }
  ],
  "transactions": [
    { "to": "0x...", "data": "0x...", "value": "0", "chainId": "8453", "description": "Approve 1000 USDC to vault" },
    { "to": "0x...", "data": "0x...", "value": "0", "chainId": "8453", "description": "Deposit 1000 USDC into vault" }
  ],
  "simulated": true,
  "simulationOk": true,
  "totalGasUsed": "350000",
  "outcome": { ... },
  "warnings": []
}
```

- `operation` — `"deposit"` | `"withdraw"` | `"supply"` | `"borrow"` | `"repay"` | `"supply_collateral"` | `"withdraw_collateral"`
- `simulated` — whether the transactions were dry-run against a fork
- `simulationOk` — present only when `simulated: true`; `false` means at least one tx reverted
- `revertReason` — present only when `simulationOk: false`; carries the first failing tx's revert message
- `totalGasUsed` — present only when `simulated: true`
- `outcome` — canonical post-state view (see below); absent when not simulated and no SDK preview is available
- `warnings` — always present (may be empty); check before presenting to the user

### `requirements` variants

- `{ "type": "approval", "token": "0x...", "spender": "0x...", "amount": "1000000000" }`
- `{ "type": "permit", "token": "0x...", "spender": "0x...", "amount": "...", "deadline": "..." }`
- `{ "type": "permit2", "token": "0x...", "spender": "0x...", "amount": "...", "deadline": "..." }`
- `{ "type": "unsupported", "token": "0x...", "reason": "...", "notes": "..." }`

Approvals are already included in `transactions` — `requirements` is informational only.

### `outcome` field

The `outcome` is the canonical post-state view, populated from simulation when available, or from SDK preview math otherwise. The agent does not need to know which source produced it — the shape is the same.

```json
{
  "outcome": {
    "vault": {
      "sharesReceived": "987654321",
      "assetsReceived": "1000000000",
      "positionAssets": "1000000000",
      "positionShares": "987654321"
    }
  }
}
```

```json
{
  "outcome": {
    "market": {
      "supplied": "0",
      "borrowed": "500000000",
      "collateral": "1000000000000000000",
      "healthFactor": "1.25",
      "isHealthy": true,
      "maxBorrowable": "200000000",
      "utilizationBeforePct": "75",
      "utilizationAfterPct": "78",
      "borrowApyBeforePct": "3.12",
      "borrowApyAfterPct": "3.45"
    }
  }
}
```

Either `vault` or `market` (or both) may be present depending on operation type.

**`vault` outcome fields:**
- `sharesReceived` — vault shares minted (deposit) or burned (withdraw); optional
- `assetsReceived` — assets received (withdraw only); optional
- `positionAssets` — total position value in assets after operation
- `positionShares` — total share balance after operation

**`market` outcome fields (all amounts are raw integer strings):**
- `supplied`, `borrowed`, `collateral` — user positions in loan-token and collateral-token units after operation
- `healthFactor` — ratio; `< 1` is liquidatable; absent when there is no borrow
- `isHealthy` — whether position is above liquidation threshold; optional
- `maxBorrowable` — max additional borrowable in loan-token units; optional
- `utilizationBeforePct`, `utilizationAfterPct` — market utilization as percent strings (`"75"` = 75%)
- `borrowApyBeforePct`, `borrowApyAfterPct` — borrow APY as percent strings; optional

---

## `prepare-deposit`

**Options:** `--chain` (required), `--vault-address` (required), `--user-address` (required), `--amount` (required; human-readable, e.g. `1000`), `--no-simulate` (optional)

Returns a `PreparedOperation` with `operation: "deposit"`. The `outcome.vault` field is populated.

---

## `prepare-withdraw`

**Options:** `--chain` (required), `--vault-address` (required), `--user-address` (required), `--amount` (required; human-readable, or `max` for the full position), `--no-simulate` (optional)

The `outcome.vault` field is populated, including `assetsReceived`.

If `--amount max` cannot withdraw the full balance, the returned `PreparedOperation` represents the largest withdrawable amount right now; `warnings[]` calls out the liquidity shortfall. Surface the warning verbatim — do not parse `summary`. The user can accept the partial amount (optionally re-run with `--amount <value>` at ~99% of `outcome.vault.assetsReceived` as an interest-accrual buffer) or wait for more liquidity.

---

## `prepare-supply`

**Options:** `--chain` (required), `--market-id` (required), `--user-address` (required), `--amount` (required; human-readable), `--no-simulate` (optional)

Returns a `PreparedOperation` with `operation: "supply"`. The `outcome.market` field is populated.

---

## `prepare-borrow`

**Options:** `--chain` (required), `--market-id` (required), `--user-address` (required), `--borrow-amount` (required; human-readable, note the flag is `--borrow-amount`, not `--amount`), `--no-simulate` (optional)

Returns a `PreparedOperation` with `operation: "borrow"`. The `outcome.market` field is populated, including `healthFactor`.

---

## `prepare-repay`

**Options:** `--chain` (required), `--market-id` (required), `--user-address` (required), `--amount` (required; human-readable, or `max` to repay the full debt), `--no-simulate` (optional)

Returns a `PreparedOperation` with `operation: "repay"`.

---

## `prepare-supply-collateral`

**Options:** `--chain` (required), `--market-id` (required), `--user-address` (required), `--amount` (required; human-readable, in collateral-asset units), `--no-simulate` (optional)

Returns a `PreparedOperation` with `operation: "supply_collateral"`. The `outcome.market` field is populated.

---

## `prepare-withdraw-collateral`

**Options:** `--chain` (required), `--market-id` (required), `--user-address` (required), `--amount` (required; human-readable, or `max` to withdraw all collateral), `--no-simulate` (optional)

Returns a `PreparedOperation` with `operation: "withdraw_collateral"`.

---

## `simulate-transactions`

Used for standalone re-simulation or simulating arbitrary transactions. Pass the `simulationPlan` from a `PreparedOperation` as `--analysis-context` for Morpho-aware post-state analysis.

**Options:** `--chain` (required), `--from` (required; sender address), `--transactions` (required; JSON string, an array of `{to, data, value}` objects), `--analysis-context` (optional; `simulationPlan` JSON string from a `PreparedOperation` for Morpho-aware post-state)

**Output:**
```json
{
  "chain": "base",
  "allSucceeded": true,
  "totalGasUsed": "245000",
  "executionResults": [
    {
      "transactionIndex": 0,
      "success": true,
      "gasUsed": "45000",
      "returnData": "0x...",
      "logs": [
        {
          "address": "0x...",
          "contract": "ERC20 (USDC)",
          "eventName": "Approval",
          "description": "Approved 1000 USDC to vault",
          "args": { "owner": "0x...", "spender": "0x...", "value": "1000000000" },
          "formatted": { "owner": "0x...", "spender": "0x...", "value": "1000 USDC" }
        }
      ]
    }
  ],
  "analysis": {
    "protocol": "morpho",
    "operation": "deposit",
    "vault": {
      "vaultAddress": "0x...",
      "sharesBefore": "0",
      "sharesAfter": "987654321",
      "assetsBefore": "0",
      "assetsAfter": "1000000000",
      "shareDelta": "987654321",
      "assetDelta": "1000000000",
      "projectedApy": "0.0534"
    },
    "warnings": []
  },
  "warnings": []
}
```

- `allSucceeded` — `true` if every transaction executed without revert
- `totalGasUsed` — sum of gas across all transactions
- `executionResults` — per-transaction results
  - `success` — `false` if reverted
  - `gasUsed` — gas used (`"0"` on failure)
  - `revertReason` — present only on failure (e.g., `"ERC4626ExceededMaxWithdraw"`)
  - `logs` — decoded event logs (present when analysis context was passed and events were decodable)
    - `contract` — contract name (e.g., `"ERC20 (USDC)"`, `"Morpho Blue"`)
    - `args` — raw event arguments; `formatted` — human-readable formatted arguments
- `analysis` — Morpho-specific pre/post state; present only when analysis context was passed and all transactions succeeded
  - `vault` — for vault operations: `sharesBefore/After`, `assetsBefore/After`, `shareDelta`, `assetDelta`, `projectedApy`
  - `market` — for market operations: `marketId`, `supplyBefore/After`, `borrowBefore/After`, `supplyDelta`, `borrowDelta`, `utilizationBefore/After`, `borrowAPYBefore/After`, `healthFactor`, `liquidationRisk`
  - `warnings` — Morpho-specific warnings
- `warnings` — top-level warnings; each has `level` (`"info"` | `"warning"` | `"error"`), `message`, optional `code`
