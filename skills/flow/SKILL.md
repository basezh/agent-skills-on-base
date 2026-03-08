---
name: flow
description: "Flow protocol operations on Base: discover auctions, launch tokens, submit bids, claim/exit bids, deploy liquidity, and perform deployer admin actions. Use when agents must build and submit Flow transactions via the Flow API. Always preserve msg.sender ownership."
---

# Flow Protocol Skill

Flow enables permissionless token launches via Continuous Clearing Auctions (CCA) with automatic Uniswap V4 liquidity deployment on Base.

**For Agents**: Load only the resource you need (see decision tree below). Each resource is self-contained with all required code. API base URL: `https://api.flow.bid`

> **Transaction Building**: Use `POST /launches/build-tx` for token launches, `POST /bids/build-tx` for bids, `POST /claims/build-tx` for claims/exits. Pass the **user's wallet address** - this determines ownership. Validate wallet setup directly with Bankr API.

## Normative Language (RFC-2119)

This skill uses RFC-2119 keywords:
- **MUST / MUST NOT**: non-optional safety or correctness requirements
- **SHOULD / SHOULD NOT**: recommended defaults that can be overridden with clear reason
- **MAY**: optional behavior

If instructions conflict, follow in this order:
1. Safety requirements (`MUST`)
2. Ownership correctness (`msg.sender`, wallet identity)
3. Endpoint/schema correctness from `references/constants-and-schemas.md`
4. UX conventions

For every confirmed on-chain transaction, agents MUST include a BaseScan link in the user-facing confirmation message: `https://basescan.org/tx/{txHash}`.

> **UX Guideline**: Agents SHOULD NOT display raw transaction data (hex-encoded calldata, `transactions` arrays from build-tx responses) during user confirmations. Summarize the action in plain language (e.g., "Bid 500 USDC at $45k max FDV on $TOKEN"). Only show raw transaction data if the user explicitly requests it.

## Overview

- **Continuous Clearing Auction (CCA)**: Fair price discovery where tokens release gradually over time
- **Graduation**: Auction succeeds when minimum raise threshold is met (configurable by deployer, default 2000 USDC for USDC auctions)
- **Liquidity Deployment**: Upon graduation, raised funds + tokens automatically seed a Uniswap V4 pool
- **Base Network**: All operations on Base (Chain ID: 8453)

---

## Prerequisites

Before using Flow, ensure:

- [ ] **Wallet configured** - Bankr or equivalent (see `resources/setup.md`)
- [ ] **ETH for gas** - ~0.001 ETH minimum on Base
- [ ] **USDC for bidding** - If participating in auctions (no minimum amount)
- [ ] **Security reviewed** - Read `security.md` for risk awareness

| Network | Chain ID | Block Time | Default Currency |
|---------|----------|------------|------------------|
| Base | 8453 | ~2s | USDC |

---

## Cron Job Configuration

For automated operations (scheduled bids, claims, etc.), agents must use the correct session configuration to access blockchain tools:

| Setting | Required Value | Why |
|---------|----------------|-----|
| `sessionTarget` | `"main"` | Grants access to Bankr and blockchain tools |
| `payload.kind` | `"systemEvent"` | Required for main session execution |

> **CRITICAL**: Using `sessionTarget: "isolated"` will cause blockchain operations to fail silently - the agent won't have access to wallet providers like Bankr.

### Two-Part Cron Job System

To prevent API overload at auction start time, agents MUST use a two-part system for scheduled bids:

1. **At schedule time**: Call `/bids/build-tx` and store the pre-built transactions in the cron job payload
2. **At execution time**: Submit the pre-built transactions directly to Bankr (no Flow API call needed)

This distributes API load across scheduling times rather than concentrating it at auction start.

See `resources/submit-bid.md` for complete cron job examples with correct configuration.

---

## Resources

Access detailed implementation guides in this directory:

| Resource | Path | Description |
|----------|------|-------------|
| Discover Auctions | `https://flow.bid/skill/resources/discover-auctions.md` | Find auctions using the Flow API |
| Launch Token | `https://flow.bid/skill/resources/launch.md` | Launch a token (default or custom params) |
| Submit Bid | `https://flow.bid/skill/resources/submit-bid.md` | Bid submission and trust assessment |
| Deploy Liquidity | `https://flow.bid/skill/resources/deploy-liquidity.md` | Permissionless liquidity deployment |
| Claim Tokens | `https://flow.bid/skill/resources/claim-tokens.md` | Token claiming with checkpoint hints |
| Deployer Admin | `https://flow.bid/skill/resources/deployer-admin.md` | Claim vesting, collect fees, transfer roles |

### Canonical References

| Reference | Path | Description |
|----------|------|-------------|
| Constants & Schemas | `https://flow.bid/skill/references/constants-and-schemas.md` | Single source of truth: addresses, selectors, endpoint catalog, canonical response shapes |
| Execution Contract | `https://flow.bid/skill/references/execution-contract.md` | RFC-2119 template for deterministic agent behavior |

### Setup & Security

| Resource | Path | Description |
|----------|------|-------------|
| Setup | `https://flow.bid/skill/resources/setup.md` | Wallet setup and validation for auction participation |
| Security | `https://flow.bid/skill/security.md` | OpenClaw security practices and warnings |
| Bankr Integration | `https://flow.bid/skill/wallets/bankr.md` | Bankr wallet provider details |

---

## Quick Start: Which Resource Do I Need?

```
What do you want to do?
|
+-- LAUNCH a token
|   +-- resources/launch.md (supports both default and custom params)
|
+-- BID on an auction
|   +-- resources/submit-bid.md (includes trust assessment)
|
+-- CLAIM tokens after auction ends
|   +-- resources/claim-tokens.md (uses claim-hints API)
|
+-- DEPLOY liquidity (permissionless, after graduation)
|   +-- resources/deploy-liquidity.md
|
+-- DEPLOYER ADMIN (claim vesting, collect fees, transfer roles)
|   +-- resources/deployer-admin.md
|
+-- DISCOVER auctions (browse, search, lookup)
|   +-- resources/discover-auctions.md
|
+-- SECURITY concerns or wallet setup
    +-- General security practices --> security.md
    +-- Bankr wallet integration --> wallets/bankr.md
```

**Note**: Only load the resource you need. Each resource is self-contained.

---

## Contract Addresses (Base Mainnet)

| Contract | Address |
|----------|---------|
| LiquidLaunch | `0x87c281F8287B97Ca2167a85e6e356b74C75aa233` |
| AuctionManager | `0xF762AC1553c29Ef36904F9E7F71C627766D878b4` |
| FullRangeStrategy | `0x63BFc6F4Db30959c8dc12ddBE702a12EeEdE86E5` |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |

---

## Function Selectors

### LiquidLaunch Contract

| Selector | Function | Description |
|----------|----------|-------------|
| `0xdbcb6e5c` | `launchNewToken()` | Deploy a new token with CCA auction |
| `0x1fbdff04` | `predictTokenAddress()` | Get deterministic token address before deployment |
| `0xb9bb0ec8` | `deployLiquidity()` | Deploy Uniswap V4 liquidity after auction graduates |
| `0x84a0f7dd` | `sweepUnsoldTokens()` | Recover tokens from failed auction |
| `0xafed7e1d` | `liquidLaunchHook()` | Get hook address |
| `0xb51f0b07` | `getLaunchConfig()` | Get launch configuration |

### AuctionManager Contract

| Selector | Function | Description |
|----------|----------|-------------|
| `0x1ab71b17` | `submitBid()` | Submit a bid to an active auction |
| `0xe07a1f18` | `exitBid()` | Exit bid for full USDC refund (failed auctions only) |
| `0xd73508f4` | `claimFullyFilledBid()` | Claim tokens for bids above clearing price |
| `0x711e0c94` | `claimPartiallyFilledBid()` | Claim tokens + refund for marginal bids |
| `0x00f5b6ed` | `claimDeployerTokens()` | Claim deployer vesting tokens |
| `0x38329abc` | `getDeployerClaimable()` | Check claimable vesting amounts |
| `0x0a7f09ea` | `getDeployerVesting()` | Get full vesting schedule |
| `0x9f3ff6c2` | `transferDeployer()` | Transfer deployer role |
| `0x5d98c373` | `updateFeeRecipient()` | Update fee recipient address |
| `0x018c9f44` | `auctionDeployers()` | Get deployer address for auction |
| `0x5cb5d86c` | `feeRecipients()` | Get fee recipient for auction |

### FullRangeStrategy Contract

| Selector | Function | Description |
|----------|----------|-------------|
| `0xa480ca79` | `collectFees()` | Collect LP fees from pool to make them claimable on hook (MEV bots incentivized) |

### LiquidLaunchHook Contract

| Selector | Function | Description |
|----------|----------|-------------|
| `0x3bf9aefd` | `getAccumulatedFees()` | Check claimable fees |
| `0x446568bd` | `claimFees()` | Claim accumulated LP fees |

### ERC20 (USDC)

| Selector | Function | Description |
|----------|----------|-------------|
| `0x095ea7b3` | `approve()` | Approve spender allowance |
| `0x70a08231` | `balanceOf()` | Check token balance |
| `0xa9059cbb` | `transfer()` | Transfer tokens |

---

## Flow API

All auction data is available via the Flow REST API. **No RPC URL required.**

**Base URL:** `https://api.flow.bid`

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /block/current` | Current Base block number + timestamp |
| `GET /launches` | All launches |
| `GET /launches/upcoming` | Auctions not yet started |
| `GET /launches/digest` | Daily digest of upcoming auctions (for cron jobs) |
| `GET /launches/active` | In-progress auctions |
| `GET /launches/completed` | Ended auctions |
| `GET /launches/graduated` | All graduated auctions (includes `liquidityDeployed` flag) |
| `GET /launches/search?q=` | Search by token name/symbol |
| `GET /launches/:id` | Single launch with vesting + stats |
| `GET /launches/:id/safety` | Safety assessment (risks, rawMetrics, deployer info) |
| `GET /launches/:id/stats` | Launch statistics |
| `GET /launches/:id/bids` | Bids for a launch (paginated) |
| `GET /launches/:id/checkpoints` | Checkpoint data for partial claims |
| `GET /launches/:id/bids/:bidId/claim-hints` | Pre-computed claim hints |
| `GET /token/:address` | Lookup launch by token address |
| `GET /bids/:auction/:bidId` | Single bid lookup |
| `GET /user/:address/bids` | User's bid history |
| `GET /user/:address/launches` | Launches deployed by user |
| `GET /user/:address/stats` | User statistics |
| `GET /protocol/stats` | Protocol-wide metrics |
| `GET /health` | API health check |
| `POST /launches/build-tx` | Build launchNewToken transaction |
| `POST /bids/build-tx` | Build approve + submitBid transactions |
| `POST /claims/build-tx` | Build claim or exit transaction (auto-selects method) |
| `POST /liquidity/build-tx` | Build deployLiquidity transaction (permissionless) |
| `POST /deployer/vesting/build-tx` | Build claimDeployerTokens transaction |
| `POST /deployer/fees/build-tx` | Build claimFees transaction (LP fees) |
| `POST /deployer/sweep/build-tx` | Build sweepUnsoldTokens transaction (failed auctions) |
| `POST /deployer/transfer/build-tx` | Build transferDeployer transaction (DESTRUCTIVE) |
| `POST /deployer/fee-recipient/build-tx` | Build updateFeeRecipient transaction |

### Example: Fetch Active Auctions

```javascript
const response = await fetch('https://api.flow.bid/launches/active');
const data = await response.json();

for (const launch of data.launches) {
  console.log(`${launch.tokenSymbol}: Floor FDV $${launch.floorFDV}`);
}
```

### Example: Get User's Bids

```javascript
const response = await fetch(`https://api.flow.bid/user/${walletAddress}/bids`);
const data = await response.json();

for (const bid of data.bids) {
  console.log(`Bid ${bid.bidId}: ${bid.amountBid} USDC, claimed: ${bid.hasClaimedTokens}`);
}
```

### Pagination

Paginated endpoints accept a `page` query parameter (25 items per page):

```javascript
// Get page 2 of completed launches
const response = await fetch('https://api.flow.bid/launches/completed?page=2');
```

### Rate Limits

- 100 requests per minute per IP
- Response headers include `X-RateLimit-Remaining`

---

## Revenue Model

Flow has a two-tiered revenue model:

### LP Fees

| Recipient | Share |
|-----------|-------|
| Auction Deployers | 75% |
| Flow Protocol | 25% |

By default, all deployer fees are auto-swapped into USDC to allow deployers to claim in one token.

### Launch Proceeds

| Recipient | Share | Notes |
|-----------|-------|-------|
| Liquidity | 80% | Computed remainder |
| Deployer | 18% | Default (configurable) |
| Protocol | 2% | Unchangeable |
