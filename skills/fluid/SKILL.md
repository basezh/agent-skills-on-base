---
name: fluid
description: Fluid Protocol — lending (ERC-4626 fTokens) and vaults (T1–T4). Deposit, withdraw, borrow, manage positions. On-chain resolvers, no API keys. Use when agents need lending or leveraged vault operations on Base.
---

# Fluid Protocol

DeFi protocol: lending (fTokens) and vaults. All reads via on-chain resolvers — no API keys.

## Lending (fTokens)

Shares ≠ assets. Use `convertToAssets(shares)` for current value.

```bash
# Get all fToken addresses
cast call 0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569 "getAllFTokens()(address[])" --rpc-url https://mainnet.base.org

# Get user position
cast call 0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569 "getUserPosition(address,address)" <fToken> <user> --rpc-url https://mainnet.base.org
```

## Base Resolver

`0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569` (same on Ethereum, Arbitrum, Base, Polygon, Plasma)

## Chains

Ethereum, Arbitrum, Base, Polygon, Plasma

**Source**: [fluid.io/skill.md](https://fluid.io/skill.md)
