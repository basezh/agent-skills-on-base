---
name: base
description: Base Skills for building on Base. Use when agents need Base Account SDK, network config, contract deployment, node setup, or MiniKit to Farcaster migration. Install individual skills from base/skills.
---

# Base Skills

[Agent Skills](https://agentskills.io) for building on [Base](https://base.org). These skills enable AI agents to connect to Base, deploy contracts, integrate wallets, run nodes, and more.

## Available Skills

| Skill | Description |
| ----- | ----------- |
| [building-with-base-account](building-with-base-account/) | Base Account SDK for authentication and payments: SIWB, Base Pay, Paymasters, Sub Accounts, Spend Permissions. |
| [connecting-to-base-network](connecting-to-base-network/) | Base Mainnet and Sepolia network configuration, RPC endpoints, chain IDs, explorer URLs. |
| [deploying-contracts-on-base](deploying-contracts-on-base/) | Deploy and verify contracts on Base with Foundry, plus troubleshooting guidance. |
| [running-a-base-node](running-a-base-node/) | Production node setup, hardware requirements, networking ports, syncing guidance. |
| [converting-minikit-to-farcaster](converting-minikit-to-farcaster/) | Migrate Mini Apps from MiniKit (OnchainKit) to native Farcaster SDK. |

## Install

```bash
npx skills add base/skills
```

**Source:** [github.com/base/skills](https://github.com/base/skills)
