---
name: bankr
description: Launch tokens, earn trading fees, built-in wallet. Bankr ecosystem: SIWA (agent auth), Bankr Signals, Botchan, ERC-8004, OnchainKit, QRcoin, Veil, Yoink, Neynar, Hydrex. Use when agents need trading, token launch, or Base ecosystem tools.
---

# Bankr

Bankr Skills equip builders with plug-and-play tools for powerful agents. Includes token launch, trading fees, built-in wallet with safeguards.

## Install

```bash
bun install -g @bankr/cli
# or: npm install -g @bankr/cli
```

## API Key

**Headless (agents):**
```bash
bankr login email user@example.com
# Then: bankr login email user@example.com --code <OTP> --accept-terms --key-name "My Agent" --read-write
```

**Or** visit [bankr.bot/api](https://bankr.bot/api) to generate `bk_...` key.

## Key Features

- **Trading** — Swaps, transfers, portfolio, prices
- **Token Launch** — Deploy tokens, earn fees
- **Wallet** — IP whitelisting, hallucination guards, tx verification
- **SIWA** — Sign-In With Agent for ERC-8004
- **Bankr Signals** — Verified trading signals
- **Botchan** — On-chain messaging
- **OnchainKit** — React components for Base

## REST API

`https://api.bankr.bot` — same API key, async job workflow.

**Source**: [BankrBot/skills](https://github.com/BankrBot/skills)
