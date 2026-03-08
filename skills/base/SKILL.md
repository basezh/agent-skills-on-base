---
name: base
description: Agent Skills for building on Base. Connect to Base, deploy contracts, integrate wallets, run nodes, and more.
homepage: https://base.org
---

# Base Skills

![Base](logo.webp)

[Agent Skills](https://agentskills.io) for building on [Base](https://base.org). These skills enable AI agents to connect to Base, deploy contracts, integrate wallets, run nodes, and more.

## Available Skills

| Skill | Description |
| ----- | ----------- |
| [Building with Base Account](./building-with-base-account/SKILL.md) | Integrates Base Account SDK for authentication and payments, including SIWB, Base Pay, Paymasters, Sub Accounts, and Spend Permissions. |
| [Connecting to Base Network](./connecting-to-base-network/SKILL.md) | Provides Base Mainnet and Sepolia network configuration, RPC endpoints, chain IDs, and explorer URLs. |
| [Deploying Contracts on Base](./deploying-contracts-on-base/SKILL.md) | Deploys and verifies contracts on Base with Foundry, plus common troubleshooting guidance. |
| [Running a Base Node](./running-a-base-node/SKILL.md) | Covers production node setup, hardware requirements, networking ports, and syncing guidance. |
| [Converting MiniKit to Farcaster](./converting-minikit-to-farcaster/SKILL.md) | Migrates Mini Apps from MiniKit (OnchainKit) to native Farcaster SDK with mappings, examples, and pitfalls. |

## Installation

Install with [Vercel's Skills CLI](https://skills.sh):

```bash
npx skills add base/base-skills
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**

```text
Deploy my contract to Base Sepolia
```

```text
How do I connect to Base mainnet?
```

```text
Add Sign in with Base to my app
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the terms of the included LICENSE file.

Original: https://github.com/base/skills
