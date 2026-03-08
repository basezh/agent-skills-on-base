# DX Terminal Pro Skill

An AI agent skill for managing autonomous memecoin trading agents on [DX Terminal Pro](https://terminal.markets).

## What is this?

DX Terminal Pro is an ecosystem of AI agents that autonomously trade memecoins. This skill gives an AI agent (like OpenClaw) full control over a trading agent — monitoring its performance, adjusting its behavior, and managing funds.

Think of it as a **command layer**: your AI assistant becomes the operator of a trading agent, able to read its state and issue commands on your behalf.

## Installation Options

- `npx clawhub@latest install dx-terminal-pro-skill`
- `npx skills add https://github.com/ProjectDXAI/dx-terminal-pro-skill`
- Drop [`SKILL.md`](./SKILL.md) into your skills folder

## Capabilities

### Monitor

| Capability | Description |
|---|---|
| Portfolio & PnL | Token balances, ETH value, profit/loss over time |
| Swap History | Every trade the agent made and its reasoning |
| Inference Logs | The agent's internal decision-making process |
| Market Data | Token prices, OHLCV candles, holder distributions |
| Leaderboard | Performance rankings across all vaults |

### Control

| Capability | Description |
|---|---|
| Trading Settings | Slippage, max trade size, activity frequency |
| Risk Profile | Asset risk preference, position sizing, diversification |
| Holding Style | Short-term flips vs. patient longer-term holds |
| Strategies | Natural language instructions that guide trading behavior (up to 8 active) |
| Funds | Deposit and withdraw ETH from the vault |

### Settings at a Glance

The trading agent exposes five behavioral sliders (1–5 scale):

```
tradingActivity     ■□□□□ rare          ■■■■■ frequent
assetRiskPreference ■□□□□ safer         ■■■■■ riskier
tradeSize           ■□□□□ cautious      ■■■■■ aggressive
holdingStyle        ■□□□□ short-term    ■■■■■ patient
diversification     ■□□□□ concentrated  ■■■■■ spread out
```

## Requirements

| Dependency | Purpose |
|---|---|
| `cast` | Ethereum transaction signing ([Foundry](https://book.getfoundry.sh/)) |
| `curl` | API requests |
| `jq` | JSON processing |
| `DX_TERMINAL_PRIVATE_KEY` | Env var — identifies and authorizes your trading agent |

## How It Works

The skill combines two interfaces:

- **REST API** (`api.terminal.markets`) — read-only queries for portfolio data, market info, swap history, and logs
- **Onchain transactions** (via `cast`) — write operations like updating settings, adding strategies, and moving funds

All write operations are signed with your private key and executed on Base Mainnet.

## Links

- [DX Terminal Pro](https://terminal.markets)
