---
name: opensea
description: Query NFT data, trade on Seaport marketplace, swap ERC20 tokens across Ethereum, Base, Arbitrum, Optimism, Polygon. Use when agents need NFT queries, marketplace operations, or token swaps.
---

# OpenSea Skill

Query NFT data, trade on Seaport, swap ERC20 tokens. Supports Base and 25+ chains.

## Prerequisites

- `OPENSEA_API_KEY` from [opensea.io/settings/developer](https://opensea.io/settings/developer)
- Node.js >= 18, `curl`, `jq`

## Install

```bash
npx skills add ProjectOpenSea/opensea-skill
npm install -g @opensea/cli
```

## CLI Examples

```bash
opensea collections get mfers
opensea listings best mfers --limit 5
opensea tokens trending --limit 5
opensea swaps quote --from-chain base --from-address 0x0 \
  --to-chain base --to-address 0xTokenAddress --quantity 0.02 --address 0xYourWallet
```

Use `--format toon` for ~40% fewer tokens (ideal for agents).

**Source**: [ProjectOpenSea/opensea-skill](https://github.com/ProjectOpenSea/opensea-skill)
