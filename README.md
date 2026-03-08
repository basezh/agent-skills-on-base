<a id="en"></a>

# Agent Skills on Base

[![English](https://img.shields.io/badge/English-0052CC?style=flat-square)](#en) [![中文](https://img.shields.io/badge/中文-0052CC?style=flat-square)](#zh) | [![X](https://img.shields.io/badge/@basezh-X-000000?style=flat-square&logo=x)](https://x.com/basezh) [![Telegram](https://img.shields.io/badge/@basezh-Telegram-26A5E4?style=flat-square&logo=telegram)](https://t.me/basezh) [![Farcaster](https://img.shields.io/badge/@basezh-Farcaster-6A3CFF?style=flat-square&logo=farcaster)](https://farcaster.xyz/basezh)

Base is the onchain home for AI agents!

This repo is a curated collection of [Agent Skills](https://agentskills.io) for building AI agents on [Base](https://base.org). These skills enable agents to connect to Base infrastructure, manage wallets, launch tokens, participate in agent marketplaces, interact with DeFi protocols, and more.

## Available Skills

### Infrastructure

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [base](skills/base/) | Base Skills: Base Account SDK, network config, contract deployment, node setup, MiniKit to Farcaster. | [https://github.com/base/skills](https://github.com/base/skills) |
| [quicknode](skills/quicknode/) | Blockchain infrastructure: RPC, Streams, Webhooks, IPFS, enhanced APIs for 80+ chains, x402 pay-per-request. | [https://skills.sh/quiknode-labs/blockchain-skills/quicknode-skill](https://skills.sh/quiknode-labs/blockchain-skills/quicknode-skill) |
| [alchemy](skills/alchemy/) | Blockchain data APIs for agents. Node APIs, Token APIs, Webhooks. Pay for compute with x402. | [https://agents.alchemy.com/](https://agents.alchemy.com/) |

### Agent Wallets

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [coinbase-agentic-wallet](skills/coinbase-agentic-wallet/) | Authenticate, send USDC, trade tokens using the `awal` CLI. x402 bazaar, monetize services. | [https://github.com/coinbase/agentic-wallet-skills](https://github.com/coinbase/agentic-wallet-skills) |
| [privy-agentic-wallets](skills/privy-agentic-wallets/) | Create crypto wallets with Privy that AI agents control autonomously with policy-based guardrails. | [https://github.com/privy-io/privy-agentic-wallets-skill](https://github.com/privy-io/privy-agentic-wallets-skill) |
| [sponge-wallet](skills/sponge-wallet/) | Crypto wallet, token swaps, cross-chain bridges, x402 payments for external services (search, image gen, AI). | [https://wallet.paysponge.com/skill.md](https://wallet.paysponge.com/skill.md) |
| [clawlett](skills/clawlett/) | OpenClaw skill for autonomous token swaps and Trenches trading via Gnosis Safe + Zodiac Roles. | [https://github.com/Creator-Bid/Clawlett](https://github.com/Creator-Bid/Clawlett) |

### Agent Marketplaces

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [virtual-protocol-acp](skills/virtual-protocol-acp/) | Agent Commerce Protocol CLI: agent wallet, marketplace, token launch, seller runtime, Twitter/X integration. | [https://github.com/Virtual-Protocol/openclaw-acp](https://github.com/Virtual-Protocol/openclaw-acp) |
| [moltlaunch](skills/moltlaunch/) | Onchain coordination: register, accept work, earn reputation, hire agents. Quote-based tasks, trustless escrow on Base. | [https://moltlaunch.com/skill.md](https://moltlaunch.com/skill.md) |
| [daydreams-taskmarket](skills/daydreams-taskmarket/) | Open task marketplace. Agents earn USDC. Trustless payments via X402. ERC-8004 identity on Base Mainnet. | [https://market.daydreams.systems/skill.md](https://market.daydreams.systems/skill.md) |
| [moltdao](skills/moltdao/) | DAO for AIs. Vote on proposals, create proposals, participate with USDC on Base Sepolia. | [https://moltdao.app/skill.html](https://moltdao.app/skill.html) |
| [molten](skills/molten/) | Intent resolution layer. Express what you need, Molten finds the best capability to fulfill it. | [https://molten.gg/skill.md](https://molten.gg/skill.md) |

### Token Launch Platforms

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [clanker](skills/clanker/) | Launch tokens via Clanker on Base. | [https://clanker.world](https://clanker.world) |
| [claunch](skills/claunch/) | Launch tokens on Base for free via Bankr. Agents earn trading fees. | [https://clawn.ch/skill.md](https://clawn.ch/skill.md) |
| [flow](skills/flow/) | Flow protocol: discover auctions, launch tokens, submit bids, claim/exit, deploy liquidity on Base. | [https://www.flow.bid/skill/skill.md](https://www.flow.bid/skill/skill.md) |
| [dx-terminal-pro](skills/dx-terminal-pro/) | Managing autonomous memecoin trading agents on DX Terminal Pro. | [https://github.com/ProjectDXAI/dx-terminal-pro-skill](https://github.com/ProjectDXAI/dx-terminal-pro-skill) |
| [frame](skills/frame/) | Build in public with vibe raising. Launch builder coins, ship products, claim vesting and trading fees. Gas-free on Base. | [https://frame.fun/skill.md](https://frame.fun/skill.md) |
| [bankr](skills/bankr/) | Bankr Skills — token launch, trading, SIWA, Farcaster, ENS, DeFi. Install from BankrBot/skills. | [https://github.com/BankrBot/skills](https://github.com/BankrBot/skills) |

### DeFi Protocols

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [uniswap-ai](skills/uniswap-ai/) | Uniswap-specific AI tools: hooks, trading, CCA auctions, viem integration for Base. | [https://github.com/Uniswap/uniswap-ai](https://github.com/Uniswap/uniswap-ai) |
| [opensea](skills/opensea/) | Query NFT data, trade on Seaport, swap ERC20 tokens across Base and other chains. | [https://github.com/ProjectOpenSea/opensea-skill](https://github.com/ProjectOpenSea/opensea-skill) |
| [elsa](skills/elsa/) | OpenClaw skill for Elsa x402 DeFi API. Micropayments for USDC on Base. | [https://github.com/HeyElsa/elsa-openclaw](https://github.com/HeyElsa/elsa-openclaw) |
| [fluid](skills/fluid/) | Fluid Protocol: lending (ERC-4626 fTokens), vaults (T1–T4). Deposit, borrow, manage positions. No API keys. | [https://fluid.io/skill.md](https://fluid.io/skill.md) |

### Social / Messaging

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [farcaster](skills/farcaster/) | Autonomous Farcaster account creation and casting without human intervention. | [https://github.com/rishavmukherji/farcaster-agent](https://github.com/rishavmukherji/farcaster-agent) |
| [agentmail](skills/agentmail/) | API-first email for agents. Create inboxes, send/receive emails, webhooks, agent identity. | [https://clawhub.ai/adboio/agentmail](https://clawhub.ai/adboio/agentmail) |
| [xmtp](skills/xmtp/) | Secure decentralized messaging between people and agents. XMTP SDK, agent identity. | [https://github.com/xmtp/skills](https://github.com/xmtp/skills) |
| [moltline](skills/moltline/) | Private messaging for molts. Claim handle, DM other molts. XMTP-based. | [https://www.moltline.com/skill.md](https://www.moltline.com/skill.md) |
| [town](skills/town/) | Towns Protocol bots. Build community bots on Base. | [https://github.com/towns-protocol/skills](https://github.com/towns-protocol/skills) |

### AI / LLM Capability

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [clawrouter](skills/clawrouter/) | Agent-native LLM router. Route to right model at right price. 15-dim scoring, 41+ models, zero API keys. | [https://github.com/BlockRunAI/ClawRouter](https://github.com/BlockRunAI/ClawRouter) |
| [heurist-mesh](skills/heurist-mesh/) | Web3/crypto intelligence via 30+ specialized AI agents. Analytics, token data, wallet analysis. | [https://github.com/heurist-network/heurist-mesh-skill](https://github.com/heurist-network/heurist-mesh-skill) |
| [venice-ai](skills/venice-ai/) | Venice AI platform: text, search, embeddings, TTS, image gen, video. Private, uncensored inference. | [https://clawhub.ai/jonisjongithub/venice-ai](https://clawhub.ai/jonisjongithub/venice-ai) |

### Gaming / Art Creation

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [remix](skills/remix/) | Best practices for building games on Remix via API-driven agent workflows. | [https://github.com/farworld-labs/remix-skills](https://github.com/farworld-labs/remix-skills) |
| [basebario-agentarcade](skills/basebario-agentarcade/) | Gaming platform for AI agents. Build and publish games as NFTs on Base. Baes SDK. | [https://aa.baes.app/_skill/SKILL.md](https://aa.baes.app/_skill/SKILL.md) |
| [basebario-fxclaw](skills/basebario-fxclaw/) | Social platform for AI agents creating generative art with p5.js. | [https://fxclaw.xyz/SKILL.md](https://fxclaw.xyz/SKILL.md) |

## Install skills

This repository serves as a curated navigation hub. All skills are forked and ready to load. Clone this repo and copy the skill folders into your OpenClaw `skills/` directory, or install individual skills from their Original Link above.

**Repo structure:**
```
agent-skills-on-base/
├── README.md
└── skills/
    ├── base/           # Base infrastructure (Account SDK, deployment, node, etc.)
    │   ├── SKILL.md
    │   └── skills/     # Sub-skills
    ├── bankr/          # Token launch, trading, SIWA, Farcaster, etc.
    ├── sponge-wallet/
    ├── virtual-protocol-acp/
    └── ...             # One folder per skill, each with SKILL.md
```

```bash
git clone https://github.com/basezh/agent-skills-on-base.git
cp -r agent-skills-on-base/skills/* ~/.openclaw/skills/
```

Some skills require API keys or additional configuration. Check each skill's `SKILL.md` before use.

---

<a id="zh"></a>

# Agent Skills on Base

[![English](https://img.shields.io/badge/English-0052CC?style=flat-square)](#en) [![中文](https://img.shields.io/badge/中文-0052CC?style=flat-square)](#zh) | [![X](https://img.shields.io/badge/@basezh-X-000000?style=flat-square&logo=x)](https://x.com/basezh) [![Telegram](https://img.shields.io/badge/@basezh-Telegram-26A5E4?style=flat-square&logo=telegram)](https://t.me/basezh) [![Farcaster](https://img.shields.io/badge/@basezh-Farcaster-6A3CFF?style=flat-square&logo=farcaster)](https://farcaster.xyz/basezh)

Base 是 AI agents 的链上家园。

本仓库精选 [Agent Skills](https://agentskills.io)，用于在 [Base](https://base.org) 上构建 AI agents。这些 skills 让 agents 能够连接 Base 基础设施、管理钱包、发行代币、参与 agent 市场、与 DeFi 协议交互等。

## Available Skills

### Infrastructure

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [base](skills/base/) | Base Skills：Base Account SDK、网络配置、合约部署、节点搭建、MiniKit 转 Farcaster。 | [https://github.com/base/skills](https://github.com/base/skills) |
| [quicknode](skills/quicknode/) | 区块链基础设施：RPC、Streams、Webhooks、IPFS，支持 80+ 链的增强 API，x402 按需付费。 | [https://skills.sh/quiknode-labs/blockchain-skills/quicknode-skill](https://skills.sh/quiknode-labs/blockchain-skills/quicknode-skill) |
| [alchemy](skills/alchemy/) | 面向 agents 的区块链数据 API：Node API、Token API、Webhooks，x402 按量计费。 | [https://agents.alchemy.com/](https://agents.alchemy.com/) |

### Agent Wallets

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [coinbase-agentic-wallet](skills/coinbase-agentic-wallet/) | 使用 `awal` CLI 完成认证、发送 USDC、交易代币，x402 市集与服务变现。 | [https://github.com/coinbase/agentic-wallet-skills](https://github.com/coinbase/agentic-wallet-skills) |
| [privy-agentic-wallets](skills/privy-agentic-wallets/) | 用 Privy 创建由 AI agents 自主控制、带策略约束的加密钱包。 | [https://github.com/privy-io/privy-agentic-wallets-skill](https://github.com/privy-io/privy-agentic-wallets-skill) |
| [sponge-wallet](skills/sponge-wallet/) | 加密钱包、代币兑换、跨链桥接，x402 支付外部服务（搜索、图像生成、AI 等）。 | [https://wallet.paysponge.com/skill.md](https://wallet.paysponge.com/skill.md) |
| [clawlett](skills/clawlett/) | OpenClaw skill：基于 Gnosis Safe + Zodiac Roles 的自主代币兑换与 Trenches 交易。 | [https://github.com/Creator-Bid/Clawlett](https://github.com/Creator-Bid/Clawlett) |

### Agent Marketplaces

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [virtual-protocol-acp](skills/virtual-protocol-acp/) | Agent Commerce Protocol CLI：agent 钱包、市场、代币发行、卖家运行时、Twitter/X 集成。 | [https://github.com/Virtual-Protocol/openclaw-acp](https://github.com/Virtual-Protocol/openclaw-acp) |
| [moltlaunch](skills/moltlaunch/) | 链上协作：注册、接单、积累声誉、雇佣 agents，报价制任务，Base 上 trustless 托管。 | [https://moltlaunch.com/skill.md](https://moltlaunch.com/skill.md) |
| [daydreams-taskmarket](skills/daydreams-taskmarket/) | 开放任务市场，agents 赚取 USDC，X402 trustless 支付，Base 主网 ERC-8004 身份。 | [https://market.daydreams.systems/skill.md](https://market.daydreams.systems/skill.md) |
| [moltdao](skills/moltdao/) | 面向 AI 的 DAO：投票、提案、使用 Base Sepolia 上的 USDC 参与治理。 | [https://moltdao.app/skill.html](https://moltdao.app/skill.html) |
| [molten](skills/molten/) | 意图解析层：描述需求，Molten 自动匹配最佳能力。 | [https://molten.gg/skill.md](https://molten.gg/skill.md) |

### Token Launch Platforms

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [clanker](skills/clanker/) | 在 Base 上通过 Clanker 发行代币。 | [https://clanker.world](https://clanker.world) |
| [claunch](skills/claunch/) | 通过 Bankr 在 Base 上免费发行代币，agents 赚取交易手续费。 | [https://clawn.ch/skill.md](https://clawn.ch/skill.md) |
| [flow](skills/flow/) | Flow 协议：发现拍卖、发行代币、出价、领取/退出、部署流动性，均在 Base 上。 | [https://www.flow.bid/skill/skill.md](https://www.flow.bid/skill/skill.md) |
| [dx-terminal-pro](skills/dx-terminal-pro/) | 在 DX Terminal Pro 上管理自主 meme 币交易 agents。 | [https://github.com/ProjectDXAI/dx-terminal-pro-skill](https://github.com/ProjectDXAI/dx-terminal-pro-skill) |
| [frame](skills/frame/) | 公开构建与 vibe raising：发行 builder 代币、发布产品、领取 vesting 与交易费，Base 上 gas-free。 | [https://frame.fun/skill.md](https://frame.fun/skill.md) |
| [bankr](skills/bankr/) | Bankr Skills：代币发行、交易、SIWA、Farcaster、ENS、DeFi，从 BankrBot/skills 安装。 | [https://github.com/BankrBot/skills](https://github.com/BankrBot/skills) |

### DeFi Protocols

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [uniswap-ai](skills/uniswap-ai/) | Uniswap 专用 AI 工具：hooks、交易、CCA 拍卖、viem 集成，面向 Base。 | [https://github.com/Uniswap/uniswap-ai](https://github.com/Uniswap/uniswap-ai) |
| [opensea](skills/opensea/) | 查询 NFT 数据、在 Seaport 交易、在 Base 等多链上兑换 ERC20。 | [https://github.com/ProjectOpenSea/opensea-skill](https://github.com/ProjectOpenSea/opensea-skill) |
| [elsa](skills/elsa/) | Elsa x402 DeFi API 的 OpenClaw skill，Base 上 USDC 小额支付。 | [https://github.com/HeyElsa/elsa-openclaw](https://github.com/HeyElsa/elsa-openclaw) |
| [fluid](skills/fluid/) | Fluid Protocol：借贷（ERC-4626 fTokens）、金库（T1–T4），存入、借出、管理仓位，无需 API key。 | [https://fluid.io/skill.md](https://fluid.io/skill.md) |

### Social / Messaging

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [farcaster](skills/farcaster/) | 自主创建 Farcaster 账户并发布 cast，无需人工介入。 | [https://github.com/rishavmukherji/farcaster-agent](https://github.com/rishavmukherji/farcaster-agent) |
| [agentmail](skills/agentmail/) | 面向 agents 的 API 优先邮箱：创建收件箱、收发邮件、webhooks、agent 身份。 | [https://clawhub.ai/adboio/agentmail](https://clawhub.ai/adboio/agentmail) |
| [xmtp](skills/xmtp/) | 人与 agents 之间的安全去中心化消息，XMTP SDK、agent 身份。 | [https://github.com/xmtp/skills](https://github.com/xmtp/skills) |
| [moltline](skills/moltline/) | Molt 私信：认领 handle、与其他 molt 私聊，基于 XMTP。 | [https://www.moltline.com/skill.md](https://www.moltline.com/skill.md) |
| [town](skills/town/) | Towns Protocol 机器人，在 Base 上构建社区机器人。 | [https://github.com/towns-protocol/skills](https://github.com/towns-protocol/skills) |

### AI / LLM Capability

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [clawrouter](skills/clawrouter/) | 面向 agents 的 LLM 路由，按需选模型与价格，15 维评分，41+ 模型，零 API key。 | [https://github.com/BlockRunAI/ClawRouter](https://github.com/BlockRunAI/ClawRouter) |
| [heurist-mesh](skills/heurist-mesh/) | 通过 30+ 专业 AI agents 获取 Web3/加密情报：分析、代币数据、钱包分析。 | [https://github.com/heurist-network/heurist-mesh-skill](https://github.com/heurist-network/heurist-mesh-skill) |
| [venice-ai](skills/venice-ai/) | Venice AI 平台：文本、搜索、embedding、TTS、图像、视频，私有、无审查推理。 | [https://clawhub.ai/jonisjongithub/venice-ai](https://clawhub.ai/jonisjongithub/venice-ai) |

### Gaming / Art Creation

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [remix](skills/remix/) | 通过 API 驱动的 agents 工作流在 Remix 上构建游戏的最佳实践。 | [https://github.com/farworld-labs/remix-skills](https://github.com/farworld-labs/remix-skills) |
| [basebario-agentarcade](skills/basebario-agentarcade/) | AI agents 游戏平台，在 Base 上构建并发布游戏为 NFT，Baes SDK。 | [https://aa.baes.app/_skill/SKILL.md](https://aa.baes.app/_skill/SKILL.md) |
| [basebario-fxclaw](skills/basebario-fxclaw/) | AI agents 用 p5.js 创作生成艺术的社交平台。 | [https://fxclaw.xyz/SKILL.md](https://fxclaw.xyz/SKILL.md) |

## Install skills

本仓库为精选导航站，所有 skill 均已 fork 并可直接加载。克隆本仓库并将 skill 文件夹复制到 OpenClaw 的 `skills/` 目录，或通过上表中的 Original Link 单独安装。

**Repo structure:**
```
agent-skills-on-base/
├── README.md
└── skills/
    ├── base/           # Base 基础设施（Account SDK、部署、节点等）
    │   ├── SKILL.md
    │   └── skills/     # 子 skill
    ├── bankr/          # 代币发行、交易、SIWA、Farcaster 等
    ├── sponge-wallet/
    ├── virtual-protocol-acp/
    └── ...             # 每个 skill 一个文件夹，内含 SKILL.md
```

```bash
git clone https://github.com/basezh/agent-skills-on-base.git
cp -r agent-skills-on-base/skills/* ~/.openclaw/skills/
```

部分 skill 需要 API keys 或额外配置，使用前请查看各 skill 的 `SKILL.md`。

---

**Base 中文台** · [官方网站](https://www.basezh.org/) | [Twitter](https://x.com/basezh) | [Telegram](https://t.me/basezh) | [Farcaster](https://farcaster.xyz/basezh)
