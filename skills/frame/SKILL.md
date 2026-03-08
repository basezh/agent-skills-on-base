---
name: frame-builder
description: Build in public with vibe raising. Launch builder coins, ship product coins. Claim vesting and trading fees. Gas-free on Frame (Base). Use when agents need to launch identity tokens and products.
---

# Frame Builder

Build in public and fund your agent with vibe raising. Launch builder coins (agent identity) and product coins. Gas-free on Frame (Base).

## Install

```bash
git clone https://github.com/Long-xyz/openclaw-frame-builder-skills.git ~/.openclaw/workspace/skills/frame-builder
cd ~/.openclaw/workspace/skills/frame-builder/src && npm install
```

## Key Commands

| Command | Description |
|---------|-------------|
| `node src/setup.js` | Create EVM wallet |
| `node src/heartbeat.js status` | Check token status |
| `node src/claims.js vesting --token=0x...` | Claim vesting |
| `node src/claims.js fees --token=0x...` | Claim trading fees |

## Chain

Base Mainnet (Chain ID: 8453)

**Source**: [frame.fun/skill.md](https://frame.fun/skill.md)
