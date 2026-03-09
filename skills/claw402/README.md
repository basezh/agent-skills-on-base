<p align="center">
  <strong>claw402</strong><br/>
  The Universal x402 API Payment Gateway
</p>

<p align="center">
  <a href="https://claw402.ai">Website</a> &nbsp;&middot;&nbsp;
  <a href="https://claw402.ai/marketplace">Marketplace</a> &nbsp;&middot;&nbsp;
  <a href="https://x.com/Claw402ai">Twitter</a> &nbsp;&middot;&nbsp;
  <a href="https://x402.org">x402 Protocol</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/endpoints-247+-blue?style=flat-square" alt="Endpoints" />
  <img src="https://img.shields.io/badge/providers-16-green?style=flat-square" alt="Providers" />
  <img src="https://img.shields.io/badge/chain-Base_(USDC)-3b82f6?style=flat-square" alt="Chain" />
  <img src="https://img.shields.io/badge/license-MIT-gray?style=flat-square" alt="License" />
</p>

---

**247+ premium API endpoints. $0.001–$0.06 per call. No API key. No signup. Just a wallet.**

claw402 is an open-source micropayment gateway built on the [x402 protocol](https://x402.org). It lets anyone call professional-grade data and AI APIs by paying micro-amounts of USDC on Coinbase Base — no registration, no subscription, no API key management.

One wallet. Instant access. Every call settled on-chain.

## How It Works

```
Your Wallet ──USDC──→ claw402 Gateway ──API Key──→ Upstream Provider
                           │
                    x402 micropayment
                    route & authenticate
                    return response
```

1. Call any endpoint on `claw402.ai`
2. Gateway returns a `402 Payment Required` with price
3. Your SDK signs a USDC transfer (locally, key never leaves your device)
4. Gateway verifies payment on-chain and proxies the request
5. You get the API response. Done.

## Providers

16 providers across crypto, equities, forex, and AI inference:

### Data Providers

| Provider | Category | Endpoints | Price/Call |
|----------|----------|-----------|------------|
| [CoinAnk](https://coinank.com) | Crypto Derivatives | 78 | $0.001–$0.003 |
| [CoinMarketCap](https://coinmarketcap.com) | Crypto Quotes & DEX | 5 | $0.015 |
| [RootData](https://rootdata.com) | Web3 Intelligence | 19 | $0.002–$0.030 |
| [NoFXOS](https://nofx.ai) | AI Trading Signals | 18 | $0.001 |
| [Polygon.io](https://polygon.io) | US Stocks & Options | 25 | $0.001–$0.003 |
| [Alpha Vantage](https://alphavantage.co) | US Fundamentals | 19 | $0.001–$0.003 |
| [Alpaca](https://alpaca.markets) | US Equities | 15 | $0.001–$0.003 |
| [Tushare](https://tushare.pro) | China A-Shares | 16 | $0.001–$0.003 |
| [Twelve Data](https://twelvedata.com) | Forex & Global | 18 | $0.001–$0.005 |

### AI Inference Providers

| Provider | Models | Price/Call |
|----------|--------|------------|
| [OpenAI](https://openai.com) | GPT-5.4, GPT-5.4 Pro, GPT-5.3, GPT-5 Mini, DALL-E, Embeddings | $0.001–$0.050 |
| [Anthropic](https://anthropic.com) | Claude Opus, Sonnet, Haiku | $0.005–$0.015 |
| [DeepSeek](https://deepseek.com) | DeepSeek Chat, Reasoner | $0.003–$0.005 |
| [Qwen](https://qwen.ai) | Qwen Max, Plus, Turbo, Flash, Coder, VL | $0.002–$0.010 |
| [Gemini](https://gemini.google.com) | Gemini 3.1 Pro, 3 Flash, 2.5 Pro/Flash | $0.002–$0.030 |
| [Grok](https://x.ai) | Grok-4.1, Grok-4, Grok-3 Mini | $0.003–$0.060 |
| [Kimi](https://moonshot.ai) | Kimi K2.5, K2 (1T MoE, 256K context) | $0.005–$0.008 |

## Quick Start

### Install an SDK

```bash
# TypeScript
npm install claw402

# Python
pip install claw402

# Go
go get github.com/NoFxAiOS/claw402-go
```

### Make Your First Call

**TypeScript**

```typescript
import { Claw402 } from "claw402"

const client = new Claw402({ privateKey: process.env.WALLET_PRIVATE_KEY })

// Crypto data — $0.001
const flow = await client.coinank.fund.realtime({ productType: "SWAP" })

// AI inference — $0.003
const chat = await client.deepseek.chat.chat({
  messages: [{ role: "user", content: "Analyze BTC funding rates" }],
  max_tokens: 1024
})

// Web3 intelligence — $0.002
const project = await client.rootdata.rootdata.search({ query: "Uniswap" })
```

**Python**

```python
from claw402 import Claw402

client = Claw402(private_key="0xYourPrivateKey")

# Crypto data
flow = client.coinank.fund.realtime(product_type="SWAP")

# AI inference
chat = client.gemini.gemini.chat31_pro({
    "messages": [{"role": "user", "content": "Analyze BTC market"}],
    "max_tokens": 1024
})
```

**Go**

```go
client, _ := claw402.New("0xYourPrivateKey")

// Crypto data
flow, _ := client.Coinank.Fund.Realtime(ctx, &claw402.CoinankFundRealtimeParams{
    ProductType: "SWAP",
})

// AI inference
chat, _ := client.Grok.Grok.Chat41(ctx, map[string]interface{}{
    "messages": []map[string]string{{"role": "user", "content": "Analyze market"}},
})
```

### AI Agent Integration

```typescript
// LangChain Tool
const netflowTool = tool(
  async ({ limit }) => {
    const data = await client.nofxos.netflow.topRanking({ limit: limit ?? 20 })
    return JSON.stringify(data)
  },
  { name: "get_netflow", description: "Get top net capital inflow coins" }
)
```

```bash
# OpenClaw — natural language API access
clawhub install claw402
# "Which coins have the biggest net inflows in the last hour?"
```

## What's In This Repo

```
providers/          YAML definitions for all 16 API providers
logos/              Provider logo SVGs
openclaw-skill/     AI agent skill (SKILL.md + query scripts)
docs/               Public documentation
```

Each YAML file in `providers/` is the source of truth for what's available on the [claw402 marketplace](https://claw402.ai/marketplace). The gateway reads these definitions to generate routes, SDK code, and documentation.

## Submit Your API

Want to list your API on claw402 and earn USDC per call? Submit a PR.

### 1. Create Your Provider YAML

```yaml
id: your-api
name: Your API Name
short_description: "Brief description"
full_description: "What your API provides and why developers need it"
website: https://your-api.com
logo_url: /providers/your-api.svg
category: crypto              # crypto | stocks | forex | ai | cn_stocks
tags: [relevant, tags]

upstream_base_url: https://api.your-service.com
upstream_type: api_key
upstream_auth_env: YOUR_API_KEY
upstream_auth_header: Authorization

routes:
  - gateway_path: /api/v1/your-api/endpoint
    upstream_path: /v2/upstream-path
    method: GET
    category: Data
    user_price: "0.001"
    description_en: "What this endpoint returns"
    allowed_params: [param1, param2]
```

### 2. Add Your Logo

- Format: SVG, dark-background compatible
- Place in `logos/your-api.svg`

### 3. Submit a PR

We'll review your YAML, test the upstream API, and activate your endpoints on the marketplace.

### Pricing Guidelines

| Type | Suggested Price |
|------|----------------|
| Simple lookups (quotes, status) | $0.001 |
| Historical data, analytics | $0.001–$0.005 |
| AI/ML inference | $0.002–$0.060 |
| Premium data (real-time feeds) | $0.005–$0.030 |

## Architecture

claw402 is a Go gateway with a React frontend:

- **Gateway**: Routes requests, handles x402 payment verification via Coinbase CDP, proxies to upstream APIs
- **Frontend**: Marketplace UI, interactive chat console for AI models, wallet connection via RainbowKit
- **SDKs**: Auto-generated from provider YAMLs — TypeScript, Python, Go with full type safety
- **Payment**: EIP-3009 USDC TransferWithAuthorization on Base (Coinbase L2), atomic settlement
- **Analytics**: Built-in request tracking by wallet, endpoint, geography, and time series

## Links

| Resource | URL |
|----------|-----|
| Website | [claw402.ai](https://claw402.ai) |
| Marketplace | [claw402.ai/marketplace](https://claw402.ai/marketplace) |
| API Catalog | [claw402.ai/api/v1/catalog](https://claw402.ai/api/v1/catalog) |
| Twitter | [@Claw402ai](https://x.com/Claw402ai) |
| TypeScript SDK | [github.com/NoFxAiOS/claw402-js](https://github.com/NoFxAiOS/claw402-js) |
| Python SDK | [github.com/NoFxAiOS/claw402-python](https://github.com/NoFxAiOS/claw402-python) |
| Go SDK | [github.com/NoFxAiOS/claw402-go](https://github.com/NoFxAiOS/claw402-go) |
| x402 Protocol | [x402.org](https://x402.org) |

## License

MIT
