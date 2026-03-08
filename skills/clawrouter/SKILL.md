---
name: clawrouter
description: The agent-native LLM router for OpenClaw. Route every request to the right model at the right price.
homepage: https://blockrun.ai
---

# ClawRouter

The agent-native LLM router for OpenClaw. Route every request to the right model at the right price. 15-dimension scoring, <1ms local routing, optimized for autonomous agents. One wallet, 41+ models, zero API keys.

## Quick Start

```bash
# 1. Install with smart routing enabled
curl -fsSL https://blockrun.ai/ClawRouter-update | bash
openclaw gateway restart

# 2. Fund your wallet with USDC on Base or Solana (address printed on install)
# $5 is enough for thousands of requests
```

Done! Smart routing (`blockrun/auto`) is now your default model.

## Routing Profiles

Choose your routing strategy with `/model <profile>`:

| Profile | Strategy | Savings | Best For |
| ---------------- | ------------------ | ------- | ---------------- |
| `/model auto` | Balanced (default) | 74-100% | General use |
| `/model eco` | Cheapest possible | 95-100% | Maximum savings |
| `/model premium` | Best quality | 0% | Mission-critical |
| `/model free` | Free tier only | 100% | Zero cost |

**Shortcuts:** `/model grok`, `/model br-sonnet`, `/model gpt5`, `/model o3`

## Image Generation

Generate images directly from chat with `/imagegen`:

```
/imagegen a dog dancing on the beach
/imagegen --model dall-e-3 a futuristic city at sunset
/imagegen --model banana-pro --size 2048x2048 mountain landscape
```

| Model | Provider | Price | Max Size |
| ------------- | --------------------- | ----------- | --------- |
| `nano-banana` | Google Gemini Flash | $0.05/image | 1024x1024 |
| `banana-pro` | Google Gemini Pro | $0.10/image | 4096x4096 |
| `dall-e-3` | OpenAI DALL-E 3 | $0.04/image | 1792x1024 |
| `gpt-image` | OpenAI GPT Image 1 | $0.02/image | 1536x1024 |
| `flux` | Black Forest Flux 1.1 | $0.04/image | 1024x1024 |

Default model: `nano-banana`. Images are returned as hosted URLs for compatibility with Telegram, Discord, and other clients.

## How It Works

**100% local routing. <1ms latency. Zero external API calls.**

```
Request → Weighted Scorer (15 dimensions) → Tier → Cheapest Model → Response
```

| Tier | ECO Model | AUTO Model | PREMIUM Model |
| --------- | ----------------------------------- | ---------------------------- | ---------------------------- |
| SIMPLE | nvidia/gpt-oss-120b (FREE) | kimi-k2.5 ($0.60/$3.00) | kimi-k2.5 |
| MEDIUM | gemini-2.5-flash-lite ($0.10/$0.40) | grok-code-fast ($0.20/$1.50) | gpt-5.2-codex ($1.75/$14.00) |
| COMPLEX | gemini-2.5-flash-lite ($0.10/$0.40) | gemini-3.1-pro ($2/$12) | claude-opus-4.6 ($5/$25) |
| REASONING | grok-4-fast ($0.20/$0.50) | grok-4-fast ($0.20/$0.50) | claude-sonnet-4.6 ($3/$15) |

**Blended average: $2.05/M** vs $25/M for Claude Opus = **92% savings**

## Payment

No account. No API key. **Payment IS authentication** via [x402](https://x402.org).

```
Request → 402 (price: $0.003) → wallet signs USDC → retry → response
```

USDC stays in your wallet until spent - non-custodial. Price is visible in the 402 header before signing.

**Dual-chain support:** Pay with **USDC** on **Base (EVM)** or **USDC on Solana** — no SOL token accepted. Both wallets are derived from a single BIP-39 mnemonic on first run.

```bash
/wallet              # Check balance and address (both chains)
/wallet export       # Export mnemonic + keys for backup
/wallet recover      # Restore wallet from mnemonic on a new machine
/wallet solana       # Switch to Solana USDC payments
/wallet base         # Switch back to Base (EVM) USDC payments
/chain solana        # Alias for /wallet solana
/stats               # View usage and savings
/stats clear         # Reset usage statistics
```

**Fund your wallet:**

- **Base (EVM):** Send USDC on Base to your EVM address
- **Solana:** Send USDC on Solana to your Solana address
- **Coinbase/CEX:** Withdraw USDC to either network
- **Credit card:** Don't have USDC? Reach out to [@bc1max on Telegram](https://t.me/bc1max) — we accept credit card payments

## Configuration

For basic usage, no configuration needed. For advanced options:

| Variable | Default | Description |
| --------------------------- | ------------------------------------- | ----------------------- |
| `BLOCKRUN_WALLET_KEY` | auto-generated | Your wallet private key |
| `BLOCKRUN_PROXY_PORT` | `8402` | Local proxy port |
| `CLAWROUTER_DISABLED` | `false` | Disable smart routing |
| `CLAWROUTER_SOLANA_RPC_URL` | `https://api.mainnet-beta.solana.com` | Solana RPC endpoint |

## Troubleshooting

**When things go wrong, run the doctor:**

```bash
npx @blockrun/clawrouter doctor
```

This collects diagnostics and sends them to Claude Sonnet for AI-powered analysis.

**Use Opus for complex issues:**

```bash
npx @blockrun/clawrouter doctor opus
```

**Ask a specific question:**

```bash
npx @blockrun/clawrouter doctor "why is my request failing?"
npx @blockrun/clawrouter doctor opus "深度分析我的配置"
```

**Cost:** Sonnet ~$0.003 (default) | Opus ~$0.01

## Support

| Channel | Link |
| --------------------- | ------------------------------------------------------------------ |
| Schedule Demo | [calendly.com/vickyfu9/30min](https://calendly.com/vickyfu9/30min) |
| Community Telegram | [t.me/blockrunAI](https://t.me/blockrunAI) |
| X / Twitter | [x.com/BlockRunAI](https://x.com/BlockRunAI) |
| Founder Telegram | [@bc1max](https://t.me/bc1max) |
| Email | vicky@blockrun.ai |

## More Resources

| Resource | Description |
| -------------------------------------------- | ------------------------ |
| [Documentation](https://blockrun.ai/docs) | Full docs |
| [Model Pricing](https://blockrun.ai/models) | All models & prices |
| [Architecture](docs/architecture.md) | Technical deep dive |
| [Configuration](docs/configuration.md) | Environment variables |
| [vs OpenRouter](docs/vs-openrouter.md) | Why ClawRouter wins |

**MIT License** · [BlockRun](https://blockrun.ai) — Pay-per-request AI infrastructure

Original: https://github.com/BlockRunAI/ClawRouter
