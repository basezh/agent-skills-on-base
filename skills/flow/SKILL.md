---
name: flow
description: Flow protocol on Base. Discover auctions, launch tokens, submit bids, claim/exit bids, deploy liquidity. Continuous Clearing Auctions (CCA) with Uniswap V4 liquidity. Use when agents need token launches or auction participation.
---

# Flow Protocol

Permissionless token launches via Continuous Clearing Auctions (CCA) with automatic Uniswap V4 liquidity on Base.

**API Base URL**: `https://api.flow.bid`

## Key Endpoints

| Endpoint | Description |
|----------|-------------|
| GET /launches/active | In-progress auctions |
| GET /launches/upcoming | Auctions not yet started |
| POST /launches/build-tx | Build launch transaction |
| POST /bids/build-tx | Build bid transaction |
| POST /claims/build-tx | Build claim/exit transaction |
| POST /liquidity/build-tx | Deploy liquidity (permissionless) |

## Prerequisites

- Wallet (Bankr or equivalent)
- ~0.001 ETH for gas on Base
- USDC for bidding

## Contract Addresses (Base Mainnet)

| Contract | Address |
|----------|---------|
| LiquidLaunch | `0x87c281F8287B97Ca2167a85e6e356b74C75aa233` |
| AuctionManager | `0xF762AC1553c29Ef36904F9E7F71C627766D878b4` |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

**Source**: [flow.bid/skill](https://www.flow.bid/skill/skill.md)
