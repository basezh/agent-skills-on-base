---
name: claw402
description: >
  Professional market data and AI APIs via x402 micropayments — no API key,
  no signup, no subscription. Pay per call with USDC on Base. 234+ endpoints
  across 16 provider groups: Web3 intelligence (RootData — 70,000+ crypto
  projects, VCs, funding rounds, trending, KOLs, personnel movement),
  crypto market data (CoinAnk derivatives analytics, nofxos.ai AI signals,
  CoinMarketCap quotes/listings/DEX/MCP), US stocks & options (Alpaca,
  Polygon, Alpha Vantage), China A-shares (Tushare), forex & global
  time-series (Twelve Data), and AI inference (GPT-5.4/5.3, Claude Opus/Sonnet/Haiku,
  DeepSeek V3/Reasoner, Qwen3-Max/Plus/Turbo/Flash/Coder/VL,
  Gemini 3.1 Pro/Flash/2.5, Grok-4.1/4/3-Mini, Kimi K2.5/K2,
  embeddings, DALL-E).
  One wallet, instant access to any paid API — no registration ever required.
version: 1.3.0
metadata:
  openclaw:
    emoji: "⚡"
    homepage: https://claw402.ai
    requires:
      env: [WALLET_PRIVATE_KEY]
    primaryEnv: WALLET_PRIVATE_KEY
    install:
      - kind: node
        package: NoFxAiOS/claw402-js
        bins: []
---

# ⚡ claw402 — Pay-Per-Call Market Data & AI APIs

> **230+ professional data endpoints. $0.001–$0.06 per call. One Base wallet.**

Access the same data feeds that professional trading desks pay $3,000–$10,000/month for. Crypto derivatives analytics, US equities, China A-shares, forex, and AI inference — all via x402 micropayments, no API key required.

---

## The Story — How $1,000 Became $800,000

Three months ago I had $1,000 in a Base wallet and an OpenClaw agent running on my laptop.

I asked the agent: *"Which coins have the most extreme funding rates right now?"*

The agent called `claw402`, paid $0.001 USDC, and came back with:

```
DOGE  funding rate: +0.312%/8h  (annualized 341%)
PEPE  funding rate: +0.287%/8h
WIF   funding rate: +0.241%/8h
```

I cross-checked: *"CVD? What are whales doing on HyperLiquid?"* Two more calls. $0.002 total.

```
CVD (last 6h): fading fast. Sellers pressing.
Top HyperLiquid whale: Short DOGE $2.1M, opened 2h ago.
```

I shorted DOGE. 40x. Three days later: **+80,000%**. That's $800,000 from $1,000. And less than $0.01 spent on data.

---

## When to Use This Skill

Use claw402 whenever the user asks about **any** of the following:

### 🌐 RootData — Web3 Project & VC Intelligence
- Search any Web3 project, VC fund, or person by keyword
- Detailed project info — funding rounds, investors, team, token, tags, ecosystem
- VC / organization profiles — portfolio, AUM, investment history
- Individual people — career history, investments, current role
- Batch investor data and funding round details
- Data change sync — track what changed in a time range
- Trending: Top 100 hot projects (24h or 7d), trending on X/Twitter, top crypto KOLs
- Personnel movement — who joined or left which crypto project
- Recently launched tokens
- Ecosystem / tag maps — full directory of all ecosystems and tags
- Query projects by ecosystem ID or tag ID
- Bulk export X/Twitter data for projects
- Available free: remaining API credits check

### 💰 CoinMarketCap — Quotes, Rankings & DEX
- Real-time crypto prices, market cap, volume, % changes (by symbol, slug, or CMC ID)
- Full cryptocurrency listings/rankings sorted by market cap, volume, or % change
- DEX trading pairs — on-chain liquidity, volume, price across Ethereum/BSC/Solana/Base/Arbitrum
- DEX token/pair search by keyword or contract address
- MCP endpoint with 12 AI tools: technical analysis, on-chain metrics, trending narratives, macro events

### 🔮 Crypto Derivatives & Market Structure
- Fear & greed index, altcoin season, market cycle indicators (AHR999, Pi Cycle, Puell)
- Fund flow & capital rotation by coin or exchange
- Liquidations — orders, heatmaps, clusters, aggregated history
- Open interest — real-time, aggregated chart, OI vs market cap
- Funding rates — current rankings, accumulated cost, weighted average, heatmap
- Long/short ratios — realtime, buy/sell, whale position, account level
- Whale activity — HyperLiquid top positions & actions, large block trades, big orders
- ETF flows — US Bitcoin ETF, US Ethereum ETF, Hong Kong crypto ETF
- AI trading signals — AI500 high-potential coins, AI300 quant rankings
- Taker flow / CVD — cumulative delta, buy/sell pressure across exchanges
- Order book depth history, liquidity heatmap
- Crypto news & flash alerts

### 📈 US Stocks & Options
- Real-time & historical quotes, trades, OHLCV bars for any US stock
- Market snapshots — full quote + bar + prev close in one call
- Top movers by % change, most active stocks by volume
- Financial news for any ticker
- Options chains — bars, quotes, snapshots for options contracts
- Corporate actions — dividends, splits

### 🇨🇳 China A-Shares
- Daily, weekly, monthly OHLCV for any A-share
- Stock basic info, trading calendar
- Fundamentals — income statement, balance sheet, cash flow, dividends
- Northbound capital flow (Hong Kong → mainland)
- Money flow, margin trading data, top lists, institutional trading

### 💹 US Stock Fundamentals & Technical Indicators
- Real-time quotes, daily/intraday/weekly/monthly OHLCV
- Company overview, earnings, income, balance sheet, cash flow
- Top gainers/losers, news sentiment
- RSI, MACD, Bollinger Bands, SMA, EMA

### 🌍 Forex, Metals & Global Time-Series
- EUR/USD, GBP/USD and any forex pair — tick or time-series
- Precious metals price and history — XAU/USD (gold), XAG/USD (silver)
- Global indices — list and real-time quotes
- Exchange rates, forex pairs reference, economic calendar
- Technical indicators — RSI, MACD, SMA, EMA, Bollinger Bands, ATR

### 🤖 AI Inference (GPT-5.4, Claude, DeepSeek, Qwen, Gemini, Grok, Kimi, Embeddings, Images)
- OpenAI GPT-5.4, GPT-5.4 Pro, GPT-5.3, GPT-5-mini, embeddings, DALL-E images
- Anthropic Claude Opus, Sonnet, Haiku
- DeepSeek V3 chat, DeepSeek-Reasoner (chain-of-thought), FIM completions
- Qwen3-Max, Qwen-Plus, Qwen-Turbo, Qwen-Flash, Qwen3-Coder-Plus, Qwen-VL (vision)
- Google Gemini 3.1 Pro, 3 Flash, 3.1 Flash-Lite, 2.5 Pro, 2.5 Flash, 2.5 Flash-Lite
- xAI Grok-4.1, Grok-4.1 Fast, Grok-4, Grok-3 Mini
- Moonshot Kimi K2.5, K2 (1T MoE, 256K context)
- Use to analyze market data your agent just fetched — chain calls in one session

---

## Cost & Privacy

| Item | Detail |
|------|--------|
| RootData search / project / org | **$0.002–$0.005 USDC** per call |
| RootData trending / KOL / maps | **$0.010–$0.030 USDC** per call |
| Crypto / stock data | **$0.001–$0.003 USDC** per call |
| CoinMarketCap quotes/DEX | **$0.015 USDC** per call |
| Twelvedata complex POST | **$0.005 USDC** per call |
| OpenAI GPT-4o chat | **$0.01 USDC** per call |
| OpenAI mini / embeddings | **$0.001–$0.005 USDC** per call |
| Claude messages | **$0.005–$0.015 USDC** per call |
| DeepSeek chat / reasoner | **$0.003–$0.005 USDC** per call |
| Qwen models | **$0.002–$0.010 USDC** per call |
| Gemini models | **$0.002–$0.030 USDC** per call |
| Grok models | **$0.003–$0.060 USDC** per call |
| Kimi models | **$0.005–$0.008 USDC** per call |
| Payment chain | Base mainnet (Coinbase L2) |
| Payment method | EIP-3009 USDC transfer, signed locally |
| Key security | Private key **never transmitted** — signs locally only |
| API key required | **No** — wallet is your credential |
| Registration | **Never** |

Get USDC on Base: [bridge.base.org](https://bridge.base.org) · Testnet USDC: [faucet.circle.com](https://faucet.circle.com)

---

## Quick Start

### 1. Set your wallet key
```
WALLET_PRIVATE_KEY=0xYourBaseWalletPrivateKey
```
Your wallet must hold USDC on **Base mainnet**.

### 2. Query any GET endpoint
```bash
node scripts/query.mjs <endpoint-path> [key=value ...]
```

### 3. Call POST endpoints (AI / Twelvedata complex)
```bash
node scripts/query.mjs <endpoint-path> --post '<json-body>'
```

### 4. Read the result
The script prints `{ status, url, data }` as formatted JSON. Parse `data` for the actual payload.

---

## Query Examples

### Crypto Market Data

```bash
# --- Market Cycle & Sentiment ---
node scripts/query.mjs /api/v1/coinank/indicator/fear-greed
node scripts/query.mjs /api/v1/coinank/indicator/altcoin-season
node scripts/query.mjs /api/v1/coinank/indicator/btc-multiplier
node scripts/query.mjs /api/v1/coinank/indicator/ahr999

# --- Fund Flow ---
node scripts/query.mjs /api/v1/nofx/netflow/top-ranking limit=20 duration=1h
node scripts/query.mjs /api/v1/coinank/fund/realtime sortBy=h1net productType=SWAP

# --- Liquidations ---
node scripts/query.mjs /api/v1/coinank/liquidation/orders baseCoin=BTC
node scripts/query.mjs /api/v1/coinank/liquidation/liq-map symbol=BTCUSDT exchange=Binance interval=1d

# --- Open Interest ---
node scripts/query.mjs /api/v1/coinank/oi/all baseCoin=BTC
node scripts/query.mjs /api/v1/nofx/oi/top-ranking limit=20 duration=1h

# --- Funding Rates ---
node scripts/query.mjs /api/v1/coinank/funding-rate/current type=current
node scripts/query.mjs /api/v1/nofx/funding-rate/top limit=20

# --- Whale Tracking ---
node scripts/query.mjs /api/v1/coinank/hyper/top-position sortBy=pnl sortType=desc
node scripts/query.mjs /api/v1/coinank/hyper/top-action

# --- ETF Flows ---
node scripts/query.mjs /api/v1/coinank/etf/us-btc-inflow
node scripts/query.mjs /api/v1/coinank/etf/us-eth-inflow

# --- AI Signals ---
node scripts/query.mjs /api/v1/nofx/ai500/list limit=20
node scripts/query.mjs /api/v1/nofx/ai300/list limit=20

# --- CVD / Taker Flow ---
node scripts/query.mjs /api/v1/coinank/market-order/agg-cvd exchanges= symbol=BTCUSDT interval=1h size=24

# --- Price & Candles ---
node scripts/query.mjs /api/v1/coinank/price/last symbol=BTCUSDT exchange=Binance productType=SWAP
node scripts/query.mjs /api/v1/coinank/kline/lists symbol=BTCUSDT exchange=Binance interval=1h size=100

# --- News ---
node scripts/query.mjs /api/v1/coinank/news/list type=2 lang=en page=1 pageSize=10
```

### RootData — Web3 Intelligence

```bash
# Search a project, VC, or person
node scripts/query.mjs /api/v1/crypto/rootdata/search --post '{"query":"Uniswap"}'
node scripts/query.mjs /api/v1/crypto/rootdata/search --post '{"query":"a16z","page":1,"page_size":10}'

# Get detailed project info (use project_id from search results)
node scripts/query.mjs /api/v1/crypto/rootdata/project --post '{"project_id":1}'

# Get VC / organization details
node scripts/query.mjs /api/v1/crypto/rootdata/org --post '{"org_id":1}'

# Get person profile
node scripts/query.mjs /api/v1/crypto/rootdata/people --post '{"people_id":1}'

# Top 100 trending projects (24h)
node scripts/query.mjs /api/v1/crypto/rootdata/hot --post '{"days":1}'

# Trending on X/Twitter
node scripts/query.mjs /api/v1/crypto/rootdata/hot-x --post '{"heat":true,"influence":true,"followers":true}'

# Top crypto KOLs on X
node scripts/query.mjs /api/v1/crypto/rootdata/kol --post '{"rank_type":"heat","page":1,"page_size":20}'

# Personnel movement (who joined / left)
node scripts/query.mjs /api/v1/crypto/rootdata/job-changes --post '{"recent_joinees":true,"recent_resignations":true}'

# Recently launched tokens
node scripts/query.mjs /api/v1/crypto/rootdata/new-tokens --post '{"page":1,"page_size":20}'

# Batch funding rounds
node scripts/query.mjs /api/v1/crypto/rootdata/funding --post '{"page":1,"page_size":10}'

# All ecosystem IDs (for filtering)
node scripts/query.mjs /api/v1/crypto/rootdata/ecosystem-map --post '{}'

# Projects in Ethereum ecosystem (get ecosystem_id from ecosystem-map)
node scripts/query.mjs /api/v1/crypto/rootdata/projects-by-ecosystem --post '{"ecosystem_ids":"1","page":1,"page_size":20}'

# All projects ID list (for building your own index)
node scripts/query.mjs /api/v1/crypto/rootdata/id-map --post '{"type":1}'

# Check remaining credits
node scripts/query.mjs /api/v1/crypto/rootdata/credits --post '{}'
```

### CoinMarketCap

```bash
# Real-time price for BTC and ETH (by symbol)
node scripts/query.mjs /api/v1/crypto/cmc/quotes symbol=BTC,ETH

# By CMC ID (1=BTC, 1027=ETH)
node scripts/query.mjs /api/v1/crypto/cmc/quotes id=1,1027

# Top 20 by market cap
node scripts/query.mjs /api/v1/crypto/cmc/listings limit=20 sort=market_cap

# Top DeFi tokens by volume
node scripts/query.mjs /api/v1/crypto/cmc/listings limit=20 tag=defi sort=volume_24h sort_dir=desc

# DEX pairs on Base with highest volume
node scripts/query.mjs /api/v1/crypto/cmc/dex/pairs network_slug=base sort=volume_24h sort_dir=desc limit=20

# Search PEPE on DEX
node scripts/query.mjs /api/v1/crypto/cmc/dex/search query=PEPE

# MCP — AI tools (12 tools available, uses JSON-RPC)
node scripts/query.mjs /api/v1/crypto/cmc/mcp --post '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get_crypto_quotes_latest","arguments":{"symbol":"BTC,ETH"}},"id":1}'
```

### US Stocks — Alpaca

```bash
# Real-time quote
node scripts/query.mjs /api/v1/alpaca/quotes/latest symbols=AAPL,TSLA,MSFT

# Historical bars
node scripts/query.mjs /api/v1/alpaca/bars symbols=AAPL timeframe=1Day start=2024-01-01 limit=30

# Market snapshot (quote + bar + prev close)
node scripts/query.mjs /api/v1/alpaca/snapshots symbols=AAPL,TSLA

# Top movers
node scripts/query.mjs /api/v1/alpaca/movers top=10 market_type=stocks

# Most active stocks
node scripts/query.mjs /api/v1/alpaca/most-actives top=10

# Latest trade
node scripts/query.mjs /api/v1/alpaca/trades/latest symbols=AAPL

# Financial news
node scripts/query.mjs /api/v1/alpaca/news symbols=AAPL limit=10

# Options chain snapshot
node scripts/query.mjs /api/v1/alpaca/options/snapshots symbols=AAPL240119C00150000
```

### US Stocks — Polygon

```bash
# OHLCV bars
node scripts/query.mjs /api/v1/polygon/aggs/ticker stocks_ticker=AAPL multiplier=1 timespan=day from=2024-01-01 to=2024-01-31

# Previous close
node scripts/query.mjs /api/v1/polygon/prev-close stocks_ticker=AAPL

# Snapshot (full quote + bar)
node scripts/query.mjs /api/v1/polygon/snapshot/ticker stocks_ticker=AAPL

# Top gainers/losers
node scripts/query.mjs /api/v1/polygon/snapshot/gainers
node scripts/query.mjs /api/v1/polygon/snapshot/losers

# Company details
node scripts/query.mjs /api/v1/polygon/ticker-details ticker=AAPL

# Market status
node scripts/query.mjs /api/v1/polygon/market-status

# Technical indicators
node scripts/query.mjs /api/v1/polygon/rsi stock_ticker=AAPL timespan=day window=14
node scripts/query.mjs /api/v1/polygon/macd stocks_ticker=AAPL timespan=day

# Options chain
node scripts/query.mjs /api/v1/polygon/options/snapshot underlying_asset=AAPL

# News
node scripts/query.mjs /api/v1/polygon/ticker-news ticker=AAPL
```

### US Stocks — Alpha Vantage Fundamentals

```bash
# Real-time quote
node scripts/query.mjs /api/v1/stocks/us/quote symbol=AAPL

# Daily OHLCV
node scripts/query.mjs /api/v1/stocks/us/daily symbol=AAPL outputsize=compact

# Intraday
node scripts/query.mjs /api/v1/stocks/us/intraday symbol=AAPL interval=5min

# Company overview
node scripts/query.mjs /api/v1/stocks/us/overview symbol=AAPL

# Earnings history
node scripts/query.mjs /api/v1/stocks/us/earnings symbol=AAPL

# Financial statements
node scripts/query.mjs /api/v1/stocks/us/income symbol=AAPL
node scripts/query.mjs /api/v1/stocks/us/balance-sheet symbol=AAPL
node scripts/query.mjs /api/v1/stocks/us/cash-flow symbol=AAPL

# Top gainers/losers/most active
node scripts/query.mjs /api/v1/stocks/us/movers

# News & sentiment
node scripts/query.mjs /api/v1/stocks/us/news tickers=AAPL

# Technical indicators
node scripts/query.mjs /api/v1/stocks/us/rsi symbol=AAPL interval=daily time_period=14
node scripts/query.mjs /api/v1/stocks/us/macd symbol=AAPL interval=daily
node scripts/query.mjs /api/v1/stocks/us/bbands symbol=AAPL interval=daily time_period=20
```

### China A-Shares — Tushare

```bash
# Stock list (all listed stocks)
node scripts/query.mjs /api/v1/stocks/cn/stock-basic list_status=L

# Daily OHLCV
node scripts/query.mjs /api/v1/stocks/cn/daily ts_code=000001.SZ start_date=20240101 end_date=20240131

# Trading calendar
node scripts/query.mjs /api/v1/stocks/cn/trade-cal start_date=20240101 end_date=20240131

# Northbound capital flow
node scripts/query.mjs /api/v1/stocks/cn/northbound trade_date=20240315

# Money flow
node scripts/query.mjs /api/v1/stocks/cn/moneyflow ts_code=000001.SZ start_date=20240101

# Margin trading data
node scripts/query.mjs /api/v1/stocks/cn/margin ts_code=000001.SZ start_date=20240101

# Top list (dragon tiger list)
node scripts/query.mjs /api/v1/stocks/cn/top-list trade_date=20240315

# Fundamentals
node scripts/query.mjs /api/v1/stocks/cn/income ts_code=000001.SZ period=20231231
node scripts/query.mjs /api/v1/stocks/cn/balance-sheet ts_code=000001.SZ period=20231231
```

### Forex & Global Time-Series — Twelve Data

```bash
# Time series — EUR/USD hourly
node scripts/query.mjs /api/v1/twelvedata/time-series symbol=EUR/USD interval=1h outputsize=50

# Real-time price
node scripts/query.mjs /api/v1/twelvedata/price symbol=BTC/USD
node scripts/query.mjs /api/v1/twelvedata/price symbol=XAU/USD

# Exchange rate
node scripts/query.mjs /api/v1/twelvedata/exchange-rate symbol=USD/JPY

# Technical indicators
node scripts/query.mjs /api/v1/twelvedata/indicator/rsi symbol=AAPL interval=1day time_period=14 outputsize=10
node scripts/query.mjs /api/v1/twelvedata/indicator/macd symbol=EUR/USD interval=1h
node scripts/query.mjs /api/v1/twelvedata/indicator/bbands symbol=AAPL interval=1day

# Precious metals
node scripts/query.mjs /api/v1/twelvedata/metals/price symbol=XAU/USD
node scripts/query.mjs /api/v1/twelvedata/metals/time-series symbol=XAU/USD interval=1day

# Global indices
node scripts/query.mjs /api/v1/twelvedata/indices/list
node scripts/query.mjs /api/v1/twelvedata/indices/quote symbol=SPX

# Economic calendar
node scripts/query.mjs /api/v1/twelvedata/economic-calendar

# Available forex pairs
node scripts/query.mjs /api/v1/twelvedata/forex-pairs
```

### AI Inference — OpenAI & Anthropic (POST)

```bash
# GPT-4o chat
node scripts/query.mjs /api/v1/ai/openai/chat --post '{"model":"gpt-4o","messages":[{"role":"user","content":"Analyze: BTC funding rate is extreme positive, CVD fading, whale just shorted. What does this mean?"}]}'

# GPT-4o-mini (cheaper)
node scripts/query.mjs /api/v1/ai/openai/chat/mini --post '{"messages":[{"role":"user","content":"Summarize AAPL earnings in 3 bullet points."}]}'

# Embeddings
node scripts/query.mjs /api/v1/ai/openai/embeddings --post '{"input":"crypto market sentiment","model":"text-embedding-3-small"}'

# List available OpenAI models
node scripts/query.mjs /api/v1/ai/openai/models

# Claude Sonnet (standard, balanced)
node scripts/query.mjs /api/v1/ai/anthropic/messages --post '{"model":"claude-sonnet-4-6","max_tokens":1024,"messages":[{"role":"user","content":"What trading setup does extreme funding + CVD divergence suggest?"}]}'

# Claude Haiku (fast, cheap)
node scripts/query.mjs /api/v1/ai/anthropic/messages/haiku --post '{"max_tokens":256,"messages":[{"role":"user","content":"One-sentence summary of BTC ETF flows today."}]}'

# Claude Opus (deepest reasoning)
node scripts/query.mjs /api/v1/ai/anthropic/messages/opus --post '{"max_tokens":2048,"messages":[{"role":"user","content":"Full macro analysis: ETF inflows strong, funding extreme, CVD diverging..."}]}'
```

### AI Inference — DeepSeek (POST)

```bash
# DeepSeek-Chat V3 (general tasks, fast, cheap)
node scripts/query.mjs /api/v1/ai/deepseek/chat --post '{"model":"deepseek-chat","messages":[{"role":"user","content":"Analyze: BTC funding rate extreme, CVD fading. What does this mean?"}]}'

# DeepSeek-Reasoner (chain-of-thought, best for complex analysis)
node scripts/query.mjs /api/v1/ai/deepseek/chat/reasoner --post '{"messages":[{"role":"user","content":"Given extreme funding rates + whale short + CVD divergence, what is the high-conviction trade?"}]}'

# FIM / code completions (beta)
node scripts/query.mjs /api/v1/ai/deepseek/completions --post '{"model":"deepseek-chat","prompt":"Summarize this market data: ","suffix":"","max_tokens":256}'

# List available DeepSeek models
node scripts/query.mjs /api/v1/ai/deepseek/models
```

### AI Inference — Qwen (POST)

```bash
# Qwen3-Max (flagship, most powerful — same cost as GPT-4o)
node scripts/query.mjs /api/v1/ai/qwen/chat/max --post '{"messages":[{"role":"user","content":"Full macro analysis: ETF inflows strong, funding extreme, CVD diverging..."}]}'

# Qwen-Plus (best value — great for most analysis tasks)
node scripts/query.mjs /api/v1/ai/qwen/chat/plus --post '{"messages":[{"role":"user","content":"Summarize the top 5 signals from this BTC market data."}]}'

# Qwen-Turbo (fast, cheap — good for quick summaries)
node scripts/query.mjs /api/v1/ai/qwen/chat/turbo --post '{"messages":[{"role":"user","content":"One-sentence summary of these ETF flows."}]}'

# Qwen-Flash (ultra-low latency, cheapest Qwen model)
node scripts/query.mjs /api/v1/ai/qwen/chat/flash --post '{"messages":[{"role":"user","content":"Is DOGE funding rate bullish or bearish right now?"}]}'

# Qwen3-Coder-Plus (code generation, analysis scripts)
node scripts/query.mjs /api/v1/ai/qwen/chat/coder --post '{"messages":[{"role":"user","content":"Write a Python script to calculate position size given 2% risk on $10,000."}]}'

# Qwen-VL-Plus (vision — analyze charts, images)
node scripts/query.mjs /api/v1/ai/qwen/chat/vl --post '{"messages":[{"role":"user","content":[{"type":"text","text":"Describe this chart pattern"},{"type":"image_url","image_url":{"url":"data:image/png;base64,..."}}]}]}'
```

### AI Inference — Gemini (POST)

```bash
# Gemini 3.1 Pro (flagship, most powerful Google model)
node scripts/query.mjs /api/v1/ai/gemini/chat/3.1-pro --post '{"messages":[{"role":"user","content":"Analyze: BTC funding rate is extreme positive, CVD fading. What does this mean?"}]}'

# Gemini 3 Flash (fast, frontier performance, low cost)
node scripts/query.mjs /api/v1/ai/gemini/chat/3-flash --post '{"messages":[{"role":"user","content":"Summarize the top 5 signals from this BTC market data."}]}'

# Gemini 3.1 Flash-Lite (ultra-fast, cheapest)
node scripts/query.mjs /api/v1/ai/gemini/chat/3.1-flash-lite --post '{"messages":[{"role":"user","content":"Is DOGE funding rate bullish or bearish right now?"}]}'

# Gemini 2.5 Pro (stable, 1M context, deep reasoning)
node scripts/query.mjs /api/v1/ai/gemini/chat/2.5-pro --post '{"messages":[{"role":"user","content":"Full macro analysis: ETF inflows strong, funding extreme..."}]}'

# Gemini 2.5 Flash (stable, best value)
node scripts/query.mjs /api/v1/ai/gemini/chat/2.5-flash --post '{"messages":[{"role":"user","content":"One-sentence summary of these ETF flows."}]}'

# List available Gemini models
node scripts/query.mjs /api/v1/ai/gemini/models
```

### AI Inference — Grok / xAI (POST)

```bash
# Grok-4.1 (latest flagship, with reasoning — premium pricing)
node scripts/query.mjs /api/v1/ai/grok/chat/4.1 --post '{"messages":[{"role":"user","content":"Given extreme funding rates + whale short + CVD divergence, what is the high-conviction trade?"}]}'

# Grok-4.1 Fast (no reasoning mode, faster response)
node scripts/query.mjs /api/v1/ai/grok/chat/4.1-fast --post '{"messages":[{"role":"user","content":"Summarize AAPL earnings in 3 bullet points."}]}'

# Grok-4 (stable, 256K context)
node scripts/query.mjs /api/v1/ai/grok/chat/4 --post '{"messages":[{"role":"user","content":"Full macro analysis: ETF inflows strong, funding extreme..."}]}'

# Grok-3 Mini (fast, cheap — good for quick summaries)
node scripts/query.mjs /api/v1/ai/grok/chat/3-mini --post '{"messages":[{"role":"user","content":"One-sentence summary of BTC ETF flows today."}]}'

# List available Grok models
node scripts/query.mjs /api/v1/ai/grok/models
```

### AI Inference — Kimi / Moonshot AI (POST)

```bash
# Kimi K2.5 (latest thinking model, Agent Swarm, 256K context)
node scripts/query.mjs /api/v1/ai/kimi/chat/k2.5 --post '{"messages":[{"role":"user","content":"Analyze: BTC funding rate extreme, CVD fading. What does this mean?"}]}'

# Kimi K2 (stable 1T MoE, 256K context, cost-effective)
node scripts/query.mjs /api/v1/ai/kimi/chat/k2 --post '{"messages":[{"role":"user","content":"Summarize the top 5 signals from this BTC market data."}]}'

# List available Kimi models
node scripts/query.mjs /api/v1/ai/kimi/models
```

**Always** run the command, then format the `data` field clearly for the user — tables, bullet points, or a brief narrative summary.

---

## Power Pattern: Chain Multiple Calls

The real power of claw402 is combining data sources in one agent session:

```bash
# Step 1: Find crowded trades ($0.001)
node scripts/query.mjs /api/v1/nofx/funding-rate/top limit=20

# Step 2: Confirm with CVD ($0.001)
node scripts/query.mjs /api/v1/coinank/market-order/agg-cvd exchanges= symbol=DOGEUSDT interval=1h size=6

# Step 3: Check whale positioning ($0.001)
node scripts/query.mjs /api/v1/coinank/hyper/top-position sortBy=value sortType=desc

# Step 4: Cross-reference with US macro ($0.001)
node scripts/query.mjs /api/v1/alpaca/movers top=10 market_type=stocks

# Step 5: Let AI synthesize the analysis (pick any model)
# Cheapest: Qwen-Flash $0.002 or DeepSeek-Chat $0.003
node scripts/query.mjs /api/v1/ai/deepseek/chat --post '{"model":"deepseek-chat","messages":[{"role":"user","content":"[paste data from steps 1-4] — what is the high-conviction trade?"}]}'
# Or for chain-of-thought reasoning: DeepSeek-Reasoner $0.005
node scripts/query.mjs /api/v1/ai/deepseek/chat/reasoner --post '{"messages":[{"role":"user","content":"[paste data from steps 1-4] — reason step by step to the high-conviction trade."}]}'
```

**Total cost: ~$0.007–$0.014 USDC.** Bloomberg Terminal equivalent: $2,000/month.

---

## Natural Language → Command Mapping

### RootData

| User says | Command |
|-----------|---------|
| "Find info about Uniswap project?" | `POST /api/v1/crypto/rootdata/search` `{"query":"Uniswap"}` |
| "Details for project ID 123?" | `POST /api/v1/crypto/rootdata/project` `{"project_id":123}` |
| "Who are a16z's portfolio projects?" | `POST /api/v1/crypto/rootdata/org` with a16z org_id |
| "Find a person in crypto?" | `POST /api/v1/crypto/rootdata/people` with people_id |
| "Top trending Web3 projects today?" | `POST /api/v1/crypto/rootdata/hot` `{"days":1}` |
| "What's trending on crypto Twitter?" | `POST /api/v1/crypto/rootdata/hot-x` |
| "Top crypto KOLs on X?" | `POST /api/v1/crypto/rootdata/kol` `{"rank_type":"heat"}` |
| "Who recently joined/left crypto companies?" | `POST /api/v1/crypto/rootdata/job-changes` |
| "Recently launched tokens?" | `POST /api/v1/crypto/rootdata/new-tokens` |
| "Recent funding rounds in Web3?" | `POST /api/v1/crypto/rootdata/funding` |
| "List all Web3 ecosystems?" | `POST /api/v1/crypto/rootdata/ecosystem-map` |
| "Projects in Solana ecosystem?" | `POST /api/v1/crypto/rootdata/projects-by-ecosystem` with Solana ecosystem_id |
| "DeFi projects list?" | `POST /api/v1/crypto/rootdata/projects-by-tag` with DeFi tag_id |
| "All project IDs for indexing?" | `POST /api/v1/crypto/rootdata/id-map` `{"type":1}` |

### CoinMarketCap

| User says | Command |
|-----------|---------|
| "BTC price?" (CMC) | `/api/v1/crypto/cmc/quotes symbol=BTC` |
| "ETH market cap?" | `/api/v1/crypto/cmc/quotes symbol=ETH` |
| "Top 50 coins by market cap?" | `/api/v1/crypto/cmc/listings limit=50` |
| "Top gainers today?" (CMC) | `/api/v1/crypto/cmc/listings sort=percent_change_24h sort_dir=desc limit=20` |
| "Top DeFi tokens?" | `/api/v1/crypto/cmc/listings tag=defi sort=market_cap` |
| "DEX pairs on Solana?" | `/api/v1/crypto/cmc/dex/pairs network_slug=solana` |
| "Search for PEPE on DEX?" | `/api/v1/crypto/cmc/dex/search query=PEPE` |
| "Find contract on Base?" | `/api/v1/crypto/cmc/dex/pairs network_slug=base contract_address=0x...` |
| "Trending crypto narratives?" | `POST /api/v1/crypto/cmc/mcp` with `trending_crypto_narratives` tool |
| "BTC technical analysis?" (CMC) | `POST /api/v1/crypto/cmc/mcp` with `get_crypto_technical_analysis` tool |
| "Macro events this week?" | `POST /api/v1/crypto/cmc/mcp` with `get_upcoming_macro_events` tool |

### Crypto (CoinAnk / nofxos.ai)

| User says | Command |
|-----------|---------|
| "Fear & greed index?" | `/api/v1/coinank/indicator/fear-greed` |
| "Altcoin season?" | `/api/v1/coinank/indicator/altcoin-season` |
| "Bitcoin cycle position?" | `/api/v1/coinank/indicator/btc-multiplier`, `ahr999` |
| "Which coins have extreme funding rates?" | `/api/v1/coinank/funding-rate/current type=current` |
| "Most negative funding rates?" | `/api/v1/nofx/funding-rate/low limit=20` |
| "Which coins have the most capital inflows?" | `/api/v1/nofx/netflow/top-ranking limit=20 duration=1h` |
| "Fund flow for BTC?" | `/api/v1/coinank/fund/realtime sortBy=h1net productType=SWAP` |
| "Recent large liquidations?" | `/api/v1/coinank/liquidation/orders baseCoin=BTC` |
| "BTC liquidation map / price clusters?" | `/api/v1/coinank/liquidation/liq-map symbol=BTCUSDT exchange=Binance interval=1d` |
| "BTC open interest?" | `/api/v1/coinank/oi/all baseCoin=BTC` |
| "Biggest OI increases?" | `/api/v1/nofx/oi/top-ranking limit=20 duration=1h` |
| "BTC long/short ratio?" | `/api/v1/coinank/longshort/realtime baseCoin=BTC interval=1h` |
| "Whale positions on HyperLiquid?" | `/api/v1/coinank/hyper/top-position sortBy=pnl sortType=desc` |
| "Recent whale trades?" | `/api/v1/coinank/hyper/top-action` |
| "Bitcoin ETF inflows today?" | `/api/v1/coinank/etf/us-btc-inflow` |
| "Ethereum ETF flows?" | `/api/v1/coinank/etf/us-eth-inflow` |
| "Top AI-picked coins?" | `/api/v1/nofx/ai500/list limit=20` |
| "CVD for BTC?" | `/api/v1/coinank/market-order/agg-cvd exchanges= symbol=BTCUSDT interval=1h size=24` |
| "Is buying pressure real?" | `/api/v1/coinank/market-order/agg-cvd` |
| "BTC price?" | `/api/v1/coinank/price/last symbol=BTCUSDT exchange=Binance productType=SWAP` |
| "Top gainers today?" | `/api/v1/nofx/price/ranking duration=24h` |
| "Trending on Upbit?" | `/api/v1/nofx/upbit/hot limit=20` |
| "Latest crypto news?" | `/api/v1/coinank/news/list type=2 lang=en page=1 pageSize=10` |

### US Stocks

| User says | Command |
|-----------|---------|
| "AAPL stock price right now?" | `/api/v1/alpaca/quotes/latest symbols=AAPL` |
| "AAPL daily chart last month?" | `/api/v1/alpaca/bars symbols=AAPL timeframe=1Day start=2024-01-01` |
| "Full AAPL snapshot?" | `/api/v1/alpaca/snapshots symbols=AAPL` |
| "Top movers today?" | `/api/v1/alpaca/movers top=10 market_type=stocks` |
| "Most traded stocks?" | `/api/v1/alpaca/most-actives top=10` |
| "AAPL OHLCV bars (Polygon)?" | `/api/v1/polygon/aggs/ticker stocks_ticker=AAPL multiplier=1 timespan=day from=... to=...` |
| "Market open today?" | `/api/v1/polygon/market-status` |
| "AAPL RSI?" | `/api/v1/polygon/rsi stock_ticker=AAPL timespan=day window=14` |
| "AAPL options chain?" | `/api/v1/polygon/options/snapshot underlying_asset=AAPL` |
| "AAPL stock overview/fundamentals?" | `/api/v1/stocks/us/overview symbol=AAPL` |
| "AAPL earnings history?" | `/api/v1/stocks/us/earnings symbol=AAPL` |
| "AAPL income statement?" | `/api/v1/stocks/us/income symbol=AAPL` |
| "AAPL MACD?" | `/api/v1/stocks/us/macd symbol=AAPL interval=daily` |
| "Top gainers/losers today?" | `/api/v1/stocks/us/movers` |
| "AAPL news sentiment?" | `/api/v1/stocks/us/news tickers=AAPL` |

### China A-Shares

| User says | Command |
|-----------|---------|
| "List all A-share stocks?" | `/api/v1/stocks/cn/stock-basic list_status=L` |
| "000001.SZ daily chart?" | `/api/v1/stocks/cn/daily ts_code=000001.SZ start_date=20240101 end_date=20240131` |
| "Trading calendar for January?" | `/api/v1/stocks/cn/trade-cal start_date=20240101 end_date=20240131` |
| "Northbound flows today?" | `/api/v1/stocks/cn/northbound trade_date=20240315` |
| "Money flow for 000001?" | `/api/v1/stocks/cn/moneyflow ts_code=000001.SZ start_date=20240101` |
| "Dragon tiger list?" | `/api/v1/stocks/cn/top-list trade_date=20240315` |
| "Margin data?" | `/api/v1/stocks/cn/margin ts_code=000001.SZ start_date=20240101` |

### Forex & Global

| User says | Command |
|-----------|---------|
| "EUR/USD rate?" | `/api/v1/twelvedata/price symbol=EUR/USD` |
| "EUR/USD hourly chart?" | `/api/v1/twelvedata/time-series symbol=EUR/USD interval=1h outputsize=50` |
| "Gold price?" | `/api/v1/twelvedata/metals/price symbol=XAU/USD` |
| "Gold daily chart?" | `/api/v1/twelvedata/metals/time-series symbol=XAU/USD interval=1day` |
| "S&P 500 index level?" | `/api/v1/twelvedata/indices/quote symbol=SPX` |
| "What global indices are available?" | `/api/v1/twelvedata/indices/list` |
| "Economic calendar this week?" | `/api/v1/twelvedata/economic-calendar` |
| "EUR/USD RSI?" | `/api/v1/twelvedata/indicator/rsi symbol=EUR/USD interval=1h time_period=14` |
| "Available forex pairs?" | `/api/v1/twelvedata/forex-pairs` |

### AI Inference

| User says | Command |
|-----------|---------|
| "Analyze this market data with AI" | `POST /api/v1/ai/openai/chat` with `gpt-4o` |
| "Quick AI summary (cheap)" | `POST /api/v1/ai/openai/chat/mini` or `POST /api/v1/ai/anthropic/messages/haiku` |
| "Deep AI analysis" | `POST /api/v1/ai/anthropic/messages/opus` |
| "Embed this text" | `POST /api/v1/ai/openai/embeddings` |
| "Generate an image" | `POST /api/v1/ai/openai/images` |
| "List OpenAI models" | `/api/v1/ai/openai/models` |
| "Use DeepSeek to analyze" | `POST /api/v1/ai/deepseek/chat` |
| "Step-by-step reasoning / think through this" | `POST /api/v1/ai/deepseek/chat/reasoner` |
| "List DeepSeek models" | `/api/v1/ai/deepseek/models` |
| "Use Qwen (Chinese AI)" | `POST /api/v1/ai/qwen/chat/plus` |
| "Cheapest Qwen model" | `POST /api/v1/ai/qwen/chat/flash` |
| "Qwen flagship / best quality" | `POST /api/v1/ai/qwen/chat/max` |
| "Qwen coding / code generation" | `POST /api/v1/ai/qwen/chat/coder` |
| "Analyze a chart image with AI" | `POST /api/v1/ai/qwen/chat/vl` (vision) |
| "Use Gemini / Google AI" | `POST /api/v1/ai/gemini/chat/3.1-pro` |
| "Cheapest Gemini model" | `POST /api/v1/ai/gemini/chat/3.1-flash-lite` |
| "Gemini with long context" | `POST /api/v1/ai/gemini/chat/2.5-pro` (1M context) |
| "Use Grok / xAI to analyze" | `POST /api/v1/ai/grok/chat/4.1` |
| "Cheapest Grok model" | `POST /api/v1/ai/grok/chat/3-mini` |
| "Use Kimi / Moonshot AI" | `POST /api/v1/ai/kimi/chat/k2.5` |
| "Cheapest Kimi model" | `POST /api/v1/ai/kimi/chat/k2` |

---

## Complete Endpoint Reference

### 🌐 RootData — Web3 Intelligence

All endpoints are **POST** with JSON body. Auth via `ROOTDATA_API_KEY` (injected server-side).

| Endpoint | Price | Description | Required params |
|----------|-------|-------------|-----------------|
| `/api/v1/crypto/rootdata/search` | $0.002 | Search projects, orgs, people | `query` (string) |
| `/api/v1/crypto/rootdata/project` | $0.005 | Project details (funding, team, tags) | `project_id` (int) OR `contract_address` |
| `/api/v1/crypto/rootdata/org` | $0.005 | VC / organization profile | `org_id` (int) |
| `/api/v1/crypto/rootdata/people` | $0.005 | Person profile (career, investments) | `people_id` (int) |
| `/api/v1/crypto/rootdata/investors` | $0.008 | Batch investor info | `page`, `page_size` |
| `/api/v1/crypto/rootdata/funding` | $0.008 | Batch funding round details | `page`, `page_size` |
| `/api/v1/crypto/rootdata/changes` | $0.005 | Data updates in time range | `start_time` (unix ts) |
| `/api/v1/crypto/rootdata/hot` | $0.010 | Top 100 trending projects | `days` (1 or 7) |
| `/api/v1/crypto/rootdata/hot-x` | $0.010 | Trending on X/Twitter | `heat`, `influence`, `followers` (bool) |
| `/api/v1/crypto/rootdata/kol` | $0.010 | Top crypto KOLs on X | `rank_type` ("heat"\|"influence") |
| `/api/v1/crypto/rootdata/job-changes` | $0.010 | Personnel movement | `recent_joinees`, `recent_resignations` (bool) |
| `/api/v1/crypto/rootdata/new-tokens` | $0.010 | Recently launched tokens | `page`, `page_size` |
| `/api/v1/crypto/rootdata/id-map` | $0.020 | All project/org/people IDs | `type` (1=proj, 2=org, 3=people) |
| `/api/v1/crypto/rootdata/ecosystem-map` | $0.020 | All ecosystem directory | — |
| `/api/v1/crypto/rootdata/tag-map` | $0.020 | All tag/category mapping | — |
| `/api/v1/crypto/rootdata/projects-by-ecosystem` | $0.015 | Projects by ecosystem ID | `ecosystem_ids` (comma-separated) |
| `/api/v1/crypto/rootdata/projects-by-tag` | $0.015 | Projects by tag ID | `tag_ids` (comma-separated) |
| `/api/v1/crypto/rootdata/twitter-map` | $0.030 | Bulk X/Twitter data export | `type` (1=proj, 2=org, 3=people) |
| `/api/v1/crypto/rootdata/credits` | $0.001 | Check remaining API credits | — |

### 💰 CoinMarketCap — $0.015/call

| Endpoint | Method | Description | Key Params |
|----------|--------|-------------|------------|
| `/api/v1/crypto/cmc/quotes` | GET | Real-time crypto quotes (price, market cap, volume, % change) | `symbol`, `id`, `slug`, `convert`, `aux` |
| `/api/v1/crypto/cmc/listings` | GET | Crypto rankings (default by market cap) | `limit`, `sort`, `sort_dir`, `tag`, `cryptocurrency_type`, `price_min/max`, `market_cap_min/max` |
| `/api/v1/crypto/cmc/dex/pairs` | GET | DEX trading pair quotes by network or contract | `network_slug`, `contract_address`, `sort`, `limit`, `liquidity_min`, `volume_24h_min` |
| `/api/v1/crypto/cmc/dex/search` | GET | Search DEX tokens/pairs by keyword or contract | `query` (required), `network` |
| `/api/v1/crypto/cmc/mcp` | POST | CoinMarketCap MCP server — 12 AI tools | JSON-RPC body with `method`, `params.name`, `params.arguments` |

**CMC MCP tools:** `get_crypto_quotes_latest` · `search_cryptos` · `get_crypto_info` · `get_crypto_technical_analysis` · `get_crypto_marketcap_technical_analysis` · `get_crypto_metrics` · `get_global_metrics_latest` · `get_global_crypto_derivatives_metrics` · `trending_crypto_narratives` · `get_upcoming_macro_events` · `get_crypto_latest_news` · `search_crypto_info`

**`network_slug` values:** `ethereum` `bsc` `solana` `base` `arbitrum` `polygon` `avalanche`

---

### 🤖 AI Trading Signals (Nofxos) — $0.001/call

| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/nofx/ai500/list` | AI500 high-potential coins (score > 70) | `limit` |
| `/api/v1/nofx/ai500/stats` | AI500 index statistics | — |
| `/api/v1/nofx/ai300/list` | AI300 quant model rankings | `limit` |
| `/api/v1/nofx/ai300/stats` | AI300 statistics | — |
| `/api/v1/nofx/netflow/top-ranking` | Top net capital inflow coins | `limit`, `duration`, `type` |
| `/api/v1/nofx/netflow/low-ranking` | Top net capital outflow coins | `limit`, `duration`, `type` |
| `/api/v1/nofx/oi/top-ranking` | Biggest OI increase coins | `limit`, `duration` |
| `/api/v1/nofx/oi/low-ranking` | Biggest OI decrease coins | `limit`, `duration` |
| `/api/v1/nofx/price/ranking` | Price change rankings | `duration` |
| `/api/v1/nofx/funding-rate/top` | Highest funding rate coins | `limit` |
| `/api/v1/nofx/funding-rate/low` | Most negative funding rate coins | `limit` |
| `/api/v1/nofx/upbit/hot` | Upbit hot coins by volume | `limit` |
| `/api/v1/nofx/upbit/netflow/top-ranking` | Upbit net inflow rankings | `limit`, `duration` |
| `/api/v1/nofx/upbit/netflow/low-ranking` | Upbit net outflow rankings | `limit`, `duration` |
| `/api/v1/nofx/query-rank/list` | Most searched coin rankings | `limit` |

**`duration` values:** `5m` `15m` `1h` `4h` `24h`

---

### 📈 Crypto Market Data (Coinank) — $0.001–$0.003/call

#### Price & Candlesticks
| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/coinank/price/last` | Real-time latest price | `symbol`, `exchange`, `productType` |
| `/api/v1/coinank/kline/lists` | OHLCV candlestick data | `symbol`, `exchange`, `interval`, `size`, `endTime` |

#### ETF Flows
| Endpoint | Description |
|----------|-------------|
| `/api/v1/coinank/etf/us-btc` | US Bitcoin ETF list (IBIT, FBTC, ARKB, etc.) |
| `/api/v1/coinank/etf/us-eth` | US Ethereum ETF list |
| `/api/v1/coinank/etf/us-btc-inflow` | US BTC ETF historical net inflow |
| `/api/v1/coinank/etf/us-eth-inflow` | US ETH ETF historical net inflow |
| `/api/v1/coinank/etf/hk-inflow` | Hong Kong crypto ETF net inflow |

#### Fund Flow
| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/coinank/fund/realtime` | Real-time fund flow rankings | `sortBy` (h1net/h4net/h24net), `productType`, `size` |
| `/api/v1/coinank/fund/history` | Historical fund flow by coin | `baseCoin`, `interval`, `size`, `endTime` |

#### Open Interest
| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/coinank/oi/all` | Real-time OI by exchange | `baseCoin` |
| `/api/v1/coinank/oi/agg-chart` | Aggregated OI history | `baseCoin`, `exchange`, `interval`, `size`, `endTime` |
| `/api/v1/coinank/oi/symbol-chart` | OI history by trading pair | `exchange`, `symbol`, `interval`, `size`, `endTime` |
| `/api/v1/coinank/oi/kline` | OI candlestick | `exchange`, `symbol`, `interval`, `size`, `endTime` |
| `/api/v1/coinank/oi/vs-market-cap-hist` | OI / market cap ratio history | `baseCoin`, `interval`, `size`, `endTime` |

#### Liquidations
| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/coinank/liquidation/orders` | Recent liquidation orders | `baseCoin`, `exchange`, `side`, `amount`, `endTime` |
| `/api/v1/coinank/liquidation/intervals` | Liquidation stats by period | `baseCoin` |
| `/api/v1/coinank/liquidation/agg-history` | Aggregated liquidation history | `baseCoin`, `interval`, `size`, `endTime` |
| `/api/v1/coinank/liquidation/liq-map` | Liquidation price-level clusters | `symbol`, `exchange`, `interval` |
| `/api/v1/coinank/liquidation/heat-map` | Liquidation heatmap | `exchange`, `symbol`, `interval` |

#### Long/Short Ratios
| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/coinank/longshort/realtime` | Real-time L/S ratio by exchange | `baseCoin`, `interval` |
| `/api/v1/coinank/longshort/buy-sell` | Global buy-sell L/S history | `baseCoin`, `interval`, `size`, `endTime` |
| `/api/v1/coinank/longshort/person` | Account-level L/S ratio | `exchange`, `symbol`, `interval`, `size`, `endTime` |
| `/api/v1/coinank/longshort/position` | Whale position-level L/S | `exchange`, `symbol`, `interval`, `size`, `endTime` |

#### Funding Rates
| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/coinank/funding-rate/current` | Real-time funding rate rankings | `type` (current/day/week/month/year) |
| `/api/v1/coinank/funding-rate/accumulated` | Accumulated funding cost | `type` |
| `/api/v1/coinank/funding-rate/hist` | Historical funding rates | `baseCoin`, `exchangeType`, `size`, `endTime` |
| `/api/v1/coinank/funding-rate/weighted` | Weighted average funding rate | `baseCoin`, `interval`, `size`, `endTime` |
| `/api/v1/coinank/funding-rate/heatmap` | Funding rate heatmap | `type` (openInterest/marketCap), `interval` |

#### Whale Activity
| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/coinank/hyper/top-position` | HyperLiquid whale positions | `sortBy`, `sortType`, `page`, `size` |
| `/api/v1/coinank/hyper/top-action` | HyperLiquid whale trade actions | — |
| `/api/v1/coinank/trades/large` | Large block trades | `symbol`, `productType`, `amount`, `size`, `endTime` |
| `/api/v1/coinank/big-order/list` | Large limit orders | `symbol`, `exchangeType`, `size`, `amount`, `side` |

#### Taker Flow / CVD
| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/coinank/market-order/cvd` | CVD for single pair | `exchange`, `symbol`, `interval`, `size`, `endTime` |
| `/api/v1/coinank/market-order/agg-cvd` | Aggregated CVD cross-exchange | `exchanges` (empty=all), `symbol`, `interval`, `size`, `endTime` |
| `/api/v1/coinank/market-order/buy-sell-value` | Taker buy/sell value USD | `exchange`, `symbol`, `interval`, `size`, `endTime` |
| `/api/v1/coinank/market-order/agg-buy-sell-value` | Aggregated buy/sell value | `exchanges`, `symbol`, `interval`, `size`, `endTime` |

#### Rankings & Screeners
| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/coinank/rank/screener` | Multi-dimensional screener | `interval` |
| `/api/v1/coinank/rank/oi` | OI rankings | `sortBy`, `sortType`, `size` |
| `/api/v1/coinank/rank/liquidation` | Liquidation rankings | `sortBy`, `sortType`, `size` |
| `/api/v1/coinank/rank/volume` | Volume rankings | `sortBy`, `sortType` |
| `/api/v1/coinank/rank/price` | Price change rankings | `sortBy`, `sortType` |
| `/api/v1/coinank/rsi/list` | RSI screener | `interval` (1H/4H/1D — uppercase) |

#### Market Cycle Indicators
| Endpoint | Description |
|----------|-------------|
| `/api/v1/coinank/indicator/fear-greed` | Crypto fear & greed index |
| `/api/v1/coinank/indicator/altcoin-season` | Altcoin Season Index |
| `/api/v1/coinank/indicator/btc-multiplier` | BTC 2-year MA multiplier |
| `/api/v1/coinank/indicator/ahr999` | AHR999 accumulation indicator |
| `/api/v1/coinank/indicator/puell-multiple` | Puell Multiple |
| `/api/v1/coinank/indicator/ma-heatmap` | 200-week MA heatmap |
| `/api/v1/coinank/indicator/market-cap-rank` | Coin market cap share |

#### News
| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/coinank/news/list` | News & flash alerts | `type` (1=flash, 2=news), `lang` (zh/en), `page`, `pageSize` |
| `/api/v1/coinank/news/detail` | Full article by ID | `id` |

---

### 📊 US Stocks — Alpaca Markets — $0.001–$0.003/call

| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/alpaca/quotes/latest` | Real-time quotes | `symbols`, `feed`, `currency` |
| `/api/v1/alpaca/quotes/history` | Historical tick quotes | `symbols`, `start`, `end`, `limit`, `feed` |
| `/api/v1/alpaca/bars/latest` | Latest OHLCV bar | `symbols`, `feed`, `currency` |
| `/api/v1/alpaca/bars` | Historical OHLCV bars | `symbols`, `timeframe`, `start`, `end`, `limit`, `adjustment` |
| `/api/v1/alpaca/trades/latest` | Real-time latest trade | `symbols`, `feed` |
| `/api/v1/alpaca/trades/history` | Historical trades | `symbols`, `start`, `end`, `limit`, `feed` |
| `/api/v1/alpaca/snapshots` | Full snapshot (multi-symbol) | `symbols`, `feed` |
| `/api/v1/alpaca/snapshot` | Full snapshot (single symbol) | `symbols`, `feed` |
| `/api/v1/alpaca/movers` | Top movers by % change | `top`, `market_type` |
| `/api/v1/alpaca/most-actives` | Most active by volume | `top`, `market_type` |
| `/api/v1/alpaca/news` | Financial news | `symbols`, `start`, `end`, `limit` |
| `/api/v1/alpaca/corporate-actions` | Dividends, splits, etc. | `symbols`, `types`, `start`, `end` |
| `/api/v1/alpaca/options/bars` | Options OHLCV bars | `symbols`, `timeframe`, `start`, `end` |
| `/api/v1/alpaca/options/quotes/latest` | Options latest quotes | `symbols`, `feed` |
| `/api/v1/alpaca/options/snapshots` | Options chain snapshots | `symbols`, `feed` |

**`timeframe` values:** `1Min` `5Min` `15Min` `1Hour` `1Day`
**`market_type` values:** `stocks` `crypto`

---

### 📉 US Stocks — Polygon — $0.001–$0.003/call

| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/polygon/aggs/ticker` | OHLCV bars | `stocks_ticker`, `multiplier`, `timespan`, `from`, `to` |
| `/api/v1/polygon/aggs/grouped` | Grouped daily bars | `date`, `adjusted` |
| `/api/v1/polygon/prev-close` | Previous session close | `stocks_ticker` |
| `/api/v1/polygon/snapshot/ticker` | Full ticker snapshot | `stocks_ticker` |
| `/api/v1/polygon/snapshot/all` | All tickers snapshot | `tickers` |
| `/api/v1/polygon/snapshot/gainers` | Top daily gainers | — |
| `/api/v1/polygon/snapshot/losers` | Top daily losers | — |
| `/api/v1/polygon/trades` | Recent trades | `stocks_ticker` |
| `/api/v1/polygon/last-trade` | Last trade | `stocks_ticker` |
| `/api/v1/polygon/quotes` | Recent quotes | `stocks_ticker` |
| `/api/v1/polygon/last-quote` | Last NBBO quote | `stocks_ticker` |
| `/api/v1/polygon/ticker-details` | Company details | `ticker` |
| `/api/v1/polygon/ticker-news` | Company news | `ticker` |
| `/api/v1/polygon/tickers` | Ticker search | `ticker`, `type`, `market` |
| `/api/v1/polygon/market-status` | US market open/closed | — |
| `/api/v1/polygon/market-holidays` | Market holidays | — |
| `/api/v1/polygon/exchanges` | Exchange list | — |
| `/api/v1/polygon/sma` | SMA indicator | `stocks_ticker`, `timespan`, `window` |
| `/api/v1/polygon/ema` | EMA indicator | `stocks_ticker`, `timespan`, `window` |
| `/api/v1/polygon/rsi` | RSI indicator | `stock_ticker`, `timespan`, `window` |
| `/api/v1/polygon/macd` | MACD indicator | `stocks_ticker`, `timespan` |
| `/api/v1/polygon/options/contracts` | Options contracts list | `underlying_asset`, `contract_type`, `expiration_date` |
| `/api/v1/polygon/options/contract-details` | Single contract details | `options_ticker` |
| `/api/v1/polygon/options/snapshot` | Options chain snapshot | `underlying_asset` |
| `/api/v1/polygon/options/snapshot/contract` | Single option snapshot | `options_ticker` |

**`timespan` values:** `minute` `hour` `day` `week` `month` `quarter` `year`

---

### 🏢 US Fundamentals — Alpha Vantage — $0.001–$0.003/call

| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/stocks/us/quote` | Real-time quote | `symbol` |
| `/api/v1/stocks/us/search` | Symbol search | `keywords` |
| `/api/v1/stocks/us/daily` | Daily OHLCV | `symbol`, `outputsize` (compact/full) |
| `/api/v1/stocks/us/daily-adjusted` | Adjusted daily OHLCV | `symbol`, `outputsize` |
| `/api/v1/stocks/us/intraday` | Intraday OHLCV | `symbol`, `interval` (1min/5min/15min/30min/60min), `outputsize` |
| `/api/v1/stocks/us/weekly` | Weekly OHLCV | `symbol` |
| `/api/v1/stocks/us/monthly` | Monthly OHLCV | `symbol` |
| `/api/v1/stocks/us/overview` | Company fundamentals | `symbol` |
| `/api/v1/stocks/us/earnings` | Quarterly & annual earnings | `symbol` |
| `/api/v1/stocks/us/income` | Income statement | `symbol` |
| `/api/v1/stocks/us/balance-sheet` | Balance sheet | `symbol` |
| `/api/v1/stocks/us/cash-flow` | Cash flow statement | `symbol` |
| `/api/v1/stocks/us/movers` | Top gainers/losers/most active | — |
| `/api/v1/stocks/us/news` | News & sentiment | `tickers`, `topics` |
| `/api/v1/stocks/us/rsi` | RSI | `symbol`, `interval`, `time_period` |
| `/api/v1/stocks/us/macd` | MACD | `symbol`, `interval` |
| `/api/v1/stocks/us/bbands` | Bollinger Bands | `symbol`, `interval`, `time_period` |
| `/api/v1/stocks/us/sma` | SMA | `symbol`, `interval`, `time_period` |
| `/api/v1/stocks/us/ema` | EMA | `symbol`, `interval`, `time_period` |

---

### 🇨🇳 China A-Shares — Tushare — $0.001–$0.003/call

| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/stocks/cn/stock-basic` | Listed stock directory | `list_status` (L/D/P), `ts_code` |
| `/api/v1/stocks/cn/daily` | Daily OHLCV | `ts_code`, `start_date`, `end_date` |
| `/api/v1/stocks/cn/weekly` | Weekly OHLCV | `ts_code`, `start_date`, `end_date` |
| `/api/v1/stocks/cn/monthly` | Monthly OHLCV | `ts_code`, `start_date`, `end_date` |
| `/api/v1/stocks/cn/daily-basic` | Daily valuation metrics | `ts_code`, `trade_date` |
| `/api/v1/stocks/cn/trade-cal` | Trading calendar | `start_date`, `end_date`, `is_open` |
| `/api/v1/stocks/cn/income` | Income statement | `ts_code`, `period` |
| `/api/v1/stocks/cn/balance-sheet` | Balance sheet | `ts_code`, `period` |
| `/api/v1/stocks/cn/cash-flow` | Cash flow statement | `ts_code`, `period` |
| `/api/v1/stocks/cn/dividend` | Dividend history | `ts_code` |
| `/api/v1/stocks/cn/northbound` | Northbound capital flow | `trade_date` |
| `/api/v1/stocks/cn/moneyflow` | Money flow (net in/out) | `ts_code`, `start_date` |
| `/api/v1/stocks/cn/margin` | Margin trading summary | `ts_code`, `start_date`, `end_date` |
| `/api/v1/stocks/cn/margin-detail` | Margin trading detail | `ts_code`, `trade_date` |
| `/api/v1/stocks/cn/top-list` | Dragon Tiger List (top traders) | `trade_date` |
| `/api/v1/stocks/cn/top-inst` | Institutional top list | `trade_date`, `ts_code` |

**Date format:** `YYYYMMDD` (e.g., `20240315`)
**Stock code format:** `000001.SZ` (Shenzhen) · `600000.SH` (Shanghai)

---

### 🌍 Forex & Global — Twelve Data — $0.001–$0.005/call

| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `/api/v1/twelvedata/time-series` | Time series (OHLCV) | `symbol`, `interval`, `outputsize` |
| `/api/v1/twelvedata/price` | Real-time price | `symbol` |
| `/api/v1/twelvedata/quote` | Full quote | `symbol` |
| `/api/v1/twelvedata/eod` | End-of-day price | `symbol` |
| `/api/v1/twelvedata/exchange-rate` | Currency exchange rate | `symbol` (e.g., `USD/JPY`) |
| `/api/v1/twelvedata/forex-pairs` | Available forex pairs | — |
| `/api/v1/twelvedata/economic-calendar` | Economic events calendar | — |
| `/api/v1/twelvedata/metals/price` | Precious metals real-time | `symbol` (XAU/USD, XAG/USD) |
| `/api/v1/twelvedata/metals/time-series` | Metals OHLCV history | `symbol`, `interval` |
| `/api/v1/twelvedata/indices/list` | Global indices directory | — |
| `/api/v1/twelvedata/indices/quote` | Index quote | `symbol` (SPX, NDX, DJI) |
| `/api/v1/twelvedata/indicator/sma` | SMA | `symbol`, `interval`, `time_period`, `outputsize` |
| `/api/v1/twelvedata/indicator/ema` | EMA | `symbol`, `interval`, `time_period`, `outputsize` |
| `/api/v1/twelvedata/indicator/rsi` | RSI | `symbol`, `interval`, `time_period`, `outputsize` |
| `/api/v1/twelvedata/indicator/macd` | MACD | `symbol`, `interval` |
| `/api/v1/twelvedata/indicator/bbands` | Bollinger Bands | `symbol`, `interval`, `time_period` |
| `/api/v1/twelvedata/indicator/atr` | ATR (volatility) | `symbol`, `interval`, `time_period` |
| `/api/v1/twelvedata/time-series/complex` | Complex multi-indicator POST | JSON body |

**`interval` values:** `1min` `5min` `15min` `30min` `1h` `2h` `4h` `1day` `1week` `1month`
**Symbol examples:** `EUR/USD` `GBP/JPY` `BTC/USD` `AAPL` `XAU/USD` `SPX`

---

### 🤖 AI Inference — OpenAI, Anthropic, DeepSeek, Qwen, Gemini, Grok, Kimi — $0.001–$0.06/call

#### OpenAI (all POST except models)
| Endpoint | Description | Cost | Body |
|----------|-------------|------|------|
| `/api/v1/ai/openai/chat` | GPT-4o chat | $0.010 | `{model, messages, max_tokens}` |
| `/api/v1/ai/openai/chat/mini` | GPT-4o-mini chat | $0.001 | `{messages, max_tokens}` |
| `/api/v1/ai/openai/embeddings` | text-embedding-3-small | $0.001 | `{input, model}` |
| `/api/v1/ai/openai/embeddings/large` | text-embedding-3-large | $0.005 | `{input, model}` |
| `/api/v1/ai/openai/images` | DALL-E image generation | $0.050 | `{prompt, n, size}` |
| `/api/v1/ai/openai/models` | List available models (GET) | $0.001 | — |

#### Anthropic (all POST)
| Endpoint | Description | Cost | Body |
|----------|-------------|------|------|
| `/api/v1/ai/anthropic/messages` | Claude Sonnet (balanced) | $0.010 | `{model, max_tokens, messages}` |
| `/api/v1/ai/anthropic/messages/haiku` | Claude Haiku (fast, cheap) | $0.005 | `{max_tokens, messages}` |
| `/api/v1/ai/anthropic/messages/opus` | Claude Opus (best reasoning) | $0.015 | `{max_tokens, messages}` |

#### DeepSeek (POST except models)
| Endpoint | Description | Cost | Body |
|----------|-------------|------|------|
| `/api/v1/ai/deepseek/chat` | DeepSeek-Chat V3 (general tasks) | $0.003 | `{model, messages, max_tokens}` |
| `/api/v1/ai/deepseek/chat/reasoner` | DeepSeek-Reasoner (chain-of-thought) | $0.005 | `{messages, max_tokens}` |
| `/api/v1/ai/deepseek/completions` | FIM / non-chat completions (beta) | $0.003 | `{model, prompt, suffix, max_tokens}` |
| `/api/v1/ai/deepseek/models` | List available models (GET) | $0.001 | — |

**DeepSeek tip:** Use `chat/reasoner` for complex multi-step market analysis — it shows its reasoning chain.

#### Qwen / 通义千问 (all POST)
| Endpoint | Description | Cost | Body |
|----------|-------------|------|------|
| `/api/v1/ai/qwen/chat/max` | Qwen3-Max (flagship, most powerful) | $0.010 | `{messages, max_tokens}` |
| `/api/v1/ai/qwen/chat/plus` | Qwen-Plus (best value) | $0.005 | `{messages, max_tokens}` |
| `/api/v1/ai/qwen/chat/turbo` | Qwen-Turbo (fast response) | $0.002 | `{messages, max_tokens}` |
| `/api/v1/ai/qwen/chat/flash` | Qwen-Flash (ultra-low latency, cheapest) | $0.002 | `{messages, max_tokens}` |
| `/api/v1/ai/qwen/chat/coder` | Qwen3-Coder-Plus (code generation) | $0.005 | `{messages, max_tokens}` |
| `/api/v1/ai/qwen/chat/vl` | Qwen-VL-Plus (vision: image + text) | $0.005 | `{messages}` with image_url content |

**Qwen tip:** Use `chat/vl` to analyze candlestick chart screenshots or trading dashboards.

#### Gemini / Google (all POST except models)
| Endpoint | Description | Cost | Body |
|----------|-------------|------|------|
| `/api/v1/ai/gemini/chat/3.1-pro` | Gemini 3.1 Pro (latest flagship) | $0.030 | `{messages, max_tokens}` |
| `/api/v1/ai/gemini/chat/3-flash` | Gemini 3 Flash (frontier, low cost) | $0.005 | `{messages, max_tokens}` |
| `/api/v1/ai/gemini/chat/3.1-flash-lite` | Gemini 3.1 Flash-Lite (fastest, cheapest) | $0.003 | `{messages, max_tokens}` |
| `/api/v1/ai/gemini/chat/2.5-pro` | Gemini 2.5 Pro (stable, 1M context) | $0.020 | `{messages, max_tokens}` |
| `/api/v1/ai/gemini/chat/2.5-flash` | Gemini 2.5 Flash (stable, best value) | $0.003 | `{messages, max_tokens}` |
| `/api/v1/ai/gemini/chat/2.5-flash-lite` | Gemini 2.5 Flash-Lite (stable, cheapest) | $0.002 | `{messages, max_tokens}` |
| `/api/v1/ai/gemini/models` | List available models (GET) | $0.001 | — |

**Gemini tip:** All models use OpenAI-compatible format. 3.1 Pro is the most capable; 3.1 Flash-Lite is the cheapest.

#### Grok / xAI (all POST except models)
| Endpoint | Description | Cost | Body |
|----------|-------------|------|------|
| `/api/v1/ai/grok/chat/4.1` | Grok-4.1 Fast with reasoning | $0.060 | `{messages, max_tokens}` |
| `/api/v1/ai/grok/chat/4.1-fast` | Grok-4.1 Fast non-reasoning (faster) | $0.040 | `{messages, max_tokens}` |
| `/api/v1/ai/grok/chat/4` | Grok-4 (stable, 256K context) | $0.050 | `{messages, max_tokens}` |
| `/api/v1/ai/grok/chat/3-mini` | Grok-3 Mini (fast, great value) | $0.003 | `{messages, max_tokens}` |
| `/api/v1/ai/grok/models` | List available models (GET) | $0.001 | — |

**Grok tip:** Grok-4.1 has built-in reasoning. Use 3-mini for cost-sensitive bulk tasks.

#### Kimi / Moonshot AI (all POST except models)
| Endpoint | Description | Cost | Body |
|----------|-------------|------|------|
| `/api/v1/ai/kimi/chat/k2.5` | Kimi K2.5 (thinking model, Agent Swarm, 256K) | $0.008 | `{messages, max_tokens}` |
| `/api/v1/ai/kimi/chat/k2` | Kimi K2 (stable 1T MoE, 256K) | $0.005 | `{messages, max_tokens}` |
| `/api/v1/ai/kimi/models` | List available models (GET) | $0.001 | — |

**Kimi tip:** Both models are 1T-parameter MoE with 256K context. K2.5 supports agent swarm capabilities.

---

## Parameter Reference

### Crypto (Coinank / Nofxos)
| Parameter | Values / Format |
|-----------|-----------------|
| `exchange` | `Binance` `OKX` `Bybit` `Bitget` `dYdX` |
| `productType` | `SWAP` (perpetual futures) · `SPOT` |
| `interval` (crypto) | `1m` `5m` `15m` `1h` `4h` `1d` |
| `duration` (nofx) | `5m` `15m` `1h` `4h` `24h` |
| `endTime` | Unix timestamp in **milliseconds** — use `Date.now()` if omitted |
| `size` | Number of data points (default varies, max ~500) |
| `sortType` | `asc` or `desc` |
| `lang` (news) | `en` (English) · `zh` (Chinese) |
| RSI `interval` | **Uppercase**: `1H` `4H` `1D` |

### US Stocks
| Parameter | Values / Format |
|-----------|-----------------|
| `symbols` (Alpaca) | Comma-separated: `AAPL,TSLA,MSFT` |
| `timeframe` (Alpaca) | `1Min` `5Min` `15Min` `1Hour` `1Day` |
| `start` / `end` (Alpaca) | ISO date: `2024-01-01` |
| `timespan` (Polygon) | `minute` `hour` `day` `week` `month` `year` |
| `from` / `to` (Polygon) | ISO date: `2024-01-01` |
| `interval` (Alpha Vantage) | `1min` `5min` `15min` `30min` `60min` `daily` `weekly` `monthly` |

### China A-Shares
| Parameter | Values / Format |
|-----------|-----------------|
| `ts_code` | `000001.SZ` (Shenzhen) · `600000.SH` (Shanghai) |
| `start_date` / `end_date` | `YYYYMMDD`: `20240101` |
| `trade_date` | `YYYYMMDD`: `20240315` |
| `list_status` | `L` (listed) · `D` (delisted) · `P` (paused) |

---

## Tips for Best Results

- **Chain data calls** for richer analysis: fetch crypto signals → US stocks → run AI synthesis in one session
- **Use `Date.now()` for `endTime`** when fetching real-time crypto data
- **`exchanges=""` (empty string)** in Coinank market-order agg endpoints means all exchanges
- **POST endpoints** (AI, Twelvedata complex): use `node scripts/query.mjs <path> --post '<json>'`
- **VIP1/2/3/4 crypto endpoints** are accessible through claw402 like all others — no extra config
- **Free catalog**: `https://claw402.ai/api/v1/catalog` — always up to date, no payment required
- **Present results clearly**: use tables or bullet points, not raw JSON. Highlight the most actionable numbers
- **Cost check**: total for a full market analysis session (5–10 calls) is typically < $0.02 USDC

---

*Powered by [claw402.ai](https://claw402.ai) — x402 micropayment gateway for AI agents.*
