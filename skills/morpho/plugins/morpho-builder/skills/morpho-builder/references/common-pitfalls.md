# Common Pitfalls for Morpho Integrators

## 1. Missing Dead Deposit

**What happens**: An attacker front-runs the first real deposit with an inflation attack, stealing funds from early depositors.

**Prevention**: Execute the dead deposit as the very first transaction on any new vault or market. Verify `totalSupply() == 0` before executing. See [dead-deposits.md](dead-deposits.md) for exact share amounts and implementation steps.

## 2. Using `withdraw()` for Full Exits

**What happens**: Due to rounding in asset-to-share conversion, a small amount of shares ("dust") remains in the user's position. The user sees a residual balance they cannot easily remove.

**Prevention**: Always use `redeem(shares, ...)` with the user's full share balance for complete withdrawals. Reserve `withdraw(assets, ...)` for partial withdrawals where the user specifies a target asset amount. See [slippage.md](slippage.md) for details.

## 3. Oracle Risk Blindness

**What happens**: Integrating a market without evaluating its oracle can expose users to liquidations from stale or manipulated price data. Worse, a reverting oracle can permanently trap funds — borrow and liquidation operations fail if the oracle call reverts.

**Key risks to evaluate**:
- **Staleness**: How frequently does the oracle update? What happens if it stops?
- **Manipulation**: Can the price be moved within a single block (e.g., via flash loans)?
- **Centralization**: Does the oracle depend on a single data source or operator?
- **Revert behavior**: Does the oracle revert on failure or return stale data?

**Prevention**: Before integrating any market, review the oracle contract. Check its update frequency, data sources, and failure modes. Prefer markets with well-audited oracles (Chainlink, Morpho-native oracles). Surface oracle metadata to users in your UI.

## 4. ERC4626 Vault as Collateral

**What happens**: If the vault's share price can be manipulated (especially V1.0 vaults), an attacker can inflate collateral value, borrow against it, then let the price correct — leaving the protocol with bad debt. This is the same class of attack as the Cream Finance hack.

**Version-specific risk**:
- **V1.0**: High risk. Share price can be flash-manipulated via bad debt realization.
- **V1.1+**: Lower risk. Bad debt is deferred, so share prices are more stable. Still requires monitoring.

**Prevention**: Do not use V1.0 MetaMorpho vaults as collateral. V1.1+ vaults without unrealized bad debt are safer but still require due diligence. See [bad-debt.md](bad-debt.md) for version differences.

## 5. ERC4626 Vault as Loan Asset

**What happens**: Share price manipulations (via donations or bad debt realization) create unpredictable liquidation incentives. Liquidators may not act because the economic calculus becomes unreliable.

**Prevention**: Do not list any ERC4626 vault as a loan asset in a Morpho market. Use only standard ERC-20 tokens as loan assets.

## 6. Ignoring Vault Governance

**What happens**: MetaMorpho vaults have privileged roles (Owner, Curator, Allocator, Guardian/Sentinel) that can change strategy, allocations, fees, and market caps. A compromised or malicious role-holder can redirect vault funds to risky markets.

**Key roles to audit**:
- **Owner**: Can change all other roles, set fees, force-set caps
- **Curator**: Can add/remove markets, set caps (with timelock)
- **Allocator**: Can reallocate funds between enabled markets
- **Guardian (V1) / Sentinel (V2)**: Can revoke pending actions and trigger emergency measures

**Prevention**: When integrating a vault, document who holds each role (EOA, multisig, governance contract). Surface this information to users. Monitor role changes and parameter updates. Prefer vaults with timelocked governance or multisig controllers.

## 7. No Slippage Protection

**What happens**: The exchange rate between assets and shares shifts between when the user previews a transaction and when it executes. Without a minimum-received check, users may receive significantly fewer shares (on deposit) or fewer assets (on withdrawal) than expected.

**Prevention**: Use `previewDeposit()` / `previewRedeem()` to estimate the output, apply a tolerance (e.g., 1%), and verify the actual result meets the minimum. See [slippage.md](slippage.md) for implementation patterns.

## 8. Vault V2 `max*` Functions

**What happens**: Code that checks `maxDeposit()` or `maxWithdraw()` before allowing operations will always see zero on Vault V2, effectively blocking all user actions.

**Prevention**: Do not gate UI actions or smart contract logic on `maxDeposit`, `maxMint`, `maxWithdraw`, or `maxRedeem` for Vault V2. See [slippage.md](slippage.md) for alternative approaches.

## 9. Incorrect Approval Pattern for USDT

**What happens**: USDT requires allowance to be reset to 0 before setting a new value. Calling `approve(spender, newAmount)` when the current allowance is non-zero reverts.

**Prevention**: Check current allowance. If non-zero, call `approve(spender, 0)` first, then `approve(spender, newAmount)`. Or use a general reset-before-set pattern for all tokens. Note: this is already covered in the main SKILL.md Safety Notes, but is repeated here because it is a frequent integration failure.

## 10. Non-Standard DAI Permit

**What happens**: DAI uses a non-standard permit function signature. Calling the EIP-2612 `permit()` on DAI will revert.

**Prevention**: Use standard ERC-20 `approve()` for DAI instead of `permit()`. Detect DAI by address and route to the `approve()` flow.
