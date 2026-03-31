---
name: zora
description: Explore Zora coins, check prices, manage wallets, and execute trades from your AI agent.
---

<a id="en"></a>

# Zora CLI Skill

You have access to the Zora CLI (`npx @zoralabs/cli`) for interacting with the Zora protocol on Base.
All commands support `--json` for structured output. Always use `--json` for parsing responses.
Trade commands require `--yes` to skip confirmation prompts.

## Environment Variables

- `ZORA_PRIVATE_KEY` - Wallet private key (hex, with or without 0x prefix)
- `ZORA_API_KEY` - API key for higher rate limits (optional, all commands work without one). Get one at zora.co/settings/developer

## Read Commands (no wallet needed)

### Browse coins

```bash
npx @zoralabs/cli explore --json --sort <sort> --type <type> --limit <n>
```

Sort: mcap, volume, new, trending, featured  
Type: all, creator-coin, post, trend  
Returns: `{ "coins": [...], "nextCursor": "..." }`

### Look up a coin

```bash
npx @zoralabs/cli get <address-or-name> --json [--type creator-coin|post|trend]
```

Returns: `{ "name", "address", "coinType", "marketCap", "volume24h", "uniqueHolders", "createdAt", "creatorHandle" }`

### Price history

```bash
npx @zoralabs/cli price-history <address-or-name> --json --interval <1h|24h|1w|1m|ALL>
```

Returns: `{ "coin", "interval", "high", "low", "change", "prices": [{ "timestamp", "price" }] }`

### Creator/user profile

```bash
npx @zoralabs/cli profile <handle-or-address> --json
```

Returns: `{ "posts": [{ "name", "address", "marketCap", "volume24h" }] }`

### Auth status

```bash
npx @zoralabs/cli auth status --json
```

Returns: `{ "authenticated": true/false, "key": "masked", "source": "path" }`

## Trade Commands (requires ZORA_PRIVATE_KEY)

### Buy a coin

```bash
npx @zoralabs/cli buy <address> --eth <amount> --json --yes
npx @zoralabs/cli buy <address> --usd <amount> --token usdc --json --yes
npx @zoralabs/cli buy <address> --percent <1-100> --json --yes
npx @zoralabs/cli buy <address> --all --token zora --json --yes
```

Use `--quote` to preview without executing.  
Returns: `{ "action": "trade", "coin", "received", "txHash", "explorerUrl" }`

### Sell a coin

```bash
npx @zoralabs/cli sell <address> --all --json --yes
npx @zoralabs/cli sell <address> --percent 50 --json --yes
npx @zoralabs/cli sell <address> --amount <n> --to usdc --json --yes
```

Returns: `{ "action": "trade", "coin", "soldAmount", "received", "txHash" }`

### Send tokens

```bash
npx @zoralabs/cli send eth --to <address> --amount <n> --json --yes
npx @zoralabs/cli send usdc --to <address> --amount <n> --json --yes
npx @zoralabs/cli send <coin-address> --to <address> --all --json --yes
```

Returns: `{ "action": "send", "asset", "amount", "to", "txHash" }`

### Check balances

```bash
npx @zoralabs/cli balance --json
```

Returns: `{ "spendable": [{ "token", "balance", "valueUsd" }], "coins": [{ "name", "balance", "valueUsd" }] }`

### Wallet info

```bash
npx @zoralabs/cli wallet info --json
```

Returns: `{ "address": "0x...", "source": "path" }`

## Error Handling

All errors in --json mode return: `{ "error": "message", "suggestion": "hint" }`  
Always check for the `error` field before processing results.

## Coin Types

- `creator-coin` — A creator's personal token (look up by handle: `get jacob --type creator-coin`)
- `post` — A coin created from a post/content
- `trend` — A trend topic coin (look up by ticker: `get zora --type trend`)

When looking up by name, use `--type` to disambiguate.  
When looking up by address (0x...), the type is resolved automatically.

---

<a id="zh"></a>

# Zora CLI Skill（中文）

可通过 Zora CLI（`npx @zoralabs/cli`）在 Base 上与 Zora 协议交互。  
所有命令均支持 `--json` 结构化输出；解析结果时请始终加上 `--json`。  
涉及交易的命令需使用 `--yes` 跳过确认提示。

## 环境变量

- `ZORA_PRIVATE_KEY` — 钱包私钥（十六进制，可带或不带 `0x` 前缀）
- `ZORA_API_KEY` — 用于更高频控额度的 API key（可选，不传也可使用全部命令）。可在 zora.co/settings/developer 申请

## 只读命令（无需钱包）

### 浏览代币

```bash
npx @zoralabs/cli explore --json --sort <sort> --type <type> --limit <n>
```

排序 sort：`mcap`、`volume`、`new`、`trending`、`featured`  
类型 type：`all`、`creator-coin`、`post`、`trend`  
返回：`{ "coins": [...], "nextCursor": "..." }`

### 查询某个代币

```bash
npx @zoralabs/cli get <address-or-name> --json [--type creator-coin|post|trend]
```

返回：`{ "name", "address", "coinType", "marketCap", "volume24h", "uniqueHolders", "createdAt", "creatorHandle" }`

### 价格历史

```bash
npx @zoralabs/cli price-history <address-or-name> --json --interval <1h|24h|1w|1m|ALL>
```

返回：`{ "coin", "interval", "high", "low", "change", "prices": [{ "timestamp", "price" }] }`

### 创作者 / 用户资料

```bash
npx @zoralabs/cli profile <handle-or-address> --json
```

返回：`{ "posts": [{ "name", "address", "marketCap", "volume24h" }] }`

### 认证状态

```bash
npx @zoralabs/cli auth status --json
```

返回：`{ "authenticated": true/false, "key": "masked", "source": "path" }`

## 交易命令（需要 `ZORA_PRIVATE_KEY`）

### 买入代币

```bash
npx @zoralabs/cli buy <address> --eth <amount> --json --yes
npx @zoralabs/cli buy <address> --usd <amount> --token usdc --json --yes
npx @zoralabs/cli buy <address> --percent <1-100> --json --yes
npx @zoralabs/cli buy <address> --all --token zora --json --yes
```

可使用 `--quote` 仅预览、不执行链上交易。  
返回：`{ "action": "trade", "coin", "received", "txHash", "explorerUrl" }`

### 卖出代币

```bash
npx @zoralabs/cli sell <address> --all --json --yes
npx @zoralabs/cli sell <address> --percent 50 --json --yes
npx @zoralabs/cli sell <address> --amount <n> --to usdc --json --yes
```

返回：`{ "action": "trade", "coin", "soldAmount", "received", "txHash" }`

### 发送资产

```bash
npx @zoralabs/cli send eth --to <address> --amount <n> --json --yes
npx @zoralabs/cli send usdc --to <address> --amount <n> --json --yes
npx @zoralabs/cli send <coin-address> --to <address> --all --json --yes
```

返回：`{ "action": "send", "asset", "amount", "to", "txHash" }`

### 查询余额

```bash
npx @zoralabs/cli balance --json
```

返回：`{ "spendable": [{ "token", "balance", "valueUsd" }], "coins": [{ "name", "balance", "valueUsd" }] }`

### 钱包信息

```bash
npx @zoralabs/cli wallet info --json
```

返回：`{ "address": "0x...", "source": "path" }`

## 错误处理

在 `--json` 模式下，所有错误统一返回：`{ "error": "message", "suggestion": "hint" }`  
处理结果前务必先检查是否存在 `error` 字段。

## 代币类型

- `creator-coin` — 创作者个人币（可按 handle 查询，例如：`get jacob --type creator-coin`）
- `post` — 由帖子 / 内容创建的代币
- `trend` — 趋势话题币（可按 ticker 查询，例如：`get zora --type trend`）

按名称查询时，请用 `--type` 消除歧义。  
按合约地址（`0x...`）查询时，类型会自动解析。
