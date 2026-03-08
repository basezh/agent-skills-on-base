---
name: connecting-to-base-network
description: Provides Base network configuration including RPC endpoints, chain IDs, and explorer URLs. Use when connecting wallets, configuring development environments, or setting up Base Mainnet or Sepolia testnet.
---

# Connecting to Base Network

## Mainnet

| Property | Value |
|----------|-------|
| Network Name | Base |
| Chain ID | 8453 |
| RPC Endpoint | `https://mainnet.base.org` |
| Currency | ETH |
| Explorer | https://basescan.org |

## Testnet (Sepolia)

| Property | Value |
|----------|-------|
| Network Name | Base Sepolia |
| Chain ID | 84532 |
| RPC Endpoint | `https://sepolia.base.org` |
| Currency | ETH |
| Explorer | https://sepolia.basescan.org |

## Security

- **Never use public RPC endpoints in production** — rate-limited, no privacy guarantees
- **Never embed RPC API keys in client-side code** — proxy through backend
- **Validate chain IDs** before signing to prevent cross-chain replay
- **Use HTTPS RPC endpoints only**

## Wallet Setup

1. Add network with chain ID and RPC from tables above
2. For testnet, use Sepolia configuration
3. Bridge ETH from Ethereum or use faucets

**Source**: [base/skills](https://github.com/base/skills)
