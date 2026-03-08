---
name: coinbase-agentic-wallet
description: Agent Skills for crypto wallet operations. Authenticate via email OTP, send USDC, trade tokens on Base using the awal CLI. Search x402 bazaar, pay for services, monetize APIs, query onchain data via CDP SQL.
---

# Coinbase Agentic Wallet Skills

Agent Skills for crypto wallet operations using the [`awal`](https://www.npmjs.com/package/awal) CLI.

## Available Sub-Skills

| Skill | Description |
|-------|-------------|
| authenticate-wallet | Sign in via email OTP |
| fund | Add money via Coinbase Onramp |
| send-usdc | Send USDC to Ethereum addresses or ENS |
| trade | Swap tokens on Base (USDC, ETH, WETH) |
| search-for-service | Search x402 bazaar for paid API services |
| pay-for-service | Make paid API requests via x402 |
| monetize-service | Build and deploy paid API for other agents |
| query-onchain-data | Query Base data via CDP SQL API (x402) |

## Install

```bash
npx skills add coinbase/agentic-wallet-skills
```

## Example Prompts

- "Sign-in to my wallet with me@email.com"
- "Send 10 USDC to barmstrong.eth"
- "Swap 0.1 ETH to USDC on Base"

**Source**: [coinbase/agentic-wallet-skills](https://github.com/coinbase/agentic-wallet-skills)
