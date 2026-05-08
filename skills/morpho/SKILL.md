---
name: morpho
description: "Query Morpho vault APYs, market rates, and positions; prepare unsigned deposit, withdraw, and borrow flows via CLI or MCP; builder pack covers SDK, GraphQL, and contract patterns for integrations."
homepage: https://github.com/morpho-org/morpho-skills
---

# Morpho Skills

查询 Morpho 金库 APY、市场利率与仓位；通过 CLI 或 MCP 准备存入、取出与借贷的未签名流程；builder 技能包涵盖 SDK、GraphQL 与合约集成模式。

> **Experimental** — Upstream marks this project as pre-v1.0; schemas and behavior may change.

## Components

| Capability | Role |
| ------------ | ---- |
| [morpho-cli](plugins/morpho-cli/skills/morpho-cli/SKILL.md) | CLI-oriented skill: query protocol data and prepare unsigned transactions. |
| [morpho-builder](plugins/morpho-builder/skills/morpho-builder/SKILL.md) | Builder reference: SDK, GraphQL, contracts, and integration patterns. |
| morpho-mcp | MCP plugin config; remote server URL: `https://mcp.morpho.org` (see [README.md](./README.md)). |

Symlinks under [`skills/`](./skills/) point at the plugin skill folders above.

## Upstream

Repository: [morpho-org/morpho-skills](https://github.com/morpho-org/morpho-skills).
