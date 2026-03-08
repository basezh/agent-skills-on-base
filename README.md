# Agent Skills on Base

A curated collection of [Agent Skills](https://agentskills.io) for building AI agents on [Base](https://base.org). These skills enable agents to connect to Base infrastructure, manage wallets, launch tokens, participate in agent marketplaces, interact with DeFi protocols, and more.

## Available Skills

### Infrastructure

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [building-with-base-account](skills/building-with-base-account/) | Base Account SDK for authentication and payments: SIWB, Base Pay, Paymasters, Sub Accounts, Spend Permissions. | [base/skills](https://github.com/base/skills) |
| [connecting-to-base-network](skills/connecting-to-base-network/) | Base Mainnet and Sepolia network configuration, RPC endpoints, chain IDs, explorer URLs. | [base/skills](https://github.com/base/skills) |
| [deploying-contracts-on-base](skills/deploying-contracts-on-base/) | Deploy and verify contracts on Base with Foundry, plus troubleshooting guidance. | [base/skills](https://github.com/base/skills) |
| [running-a-base-node](skills/running-a-base-node/) | Production node setup, hardware requirements, networking ports, syncing guidance. | [base/skills](https://github.com/base/skills) |
| [converting-minikit-to-farcaster](skills/converting-minikit-to-farcaster/) | Migrate Mini Apps from MiniKit (OnchainKit) to native Farcaster SDK. | [base/skills](https://github.com/base/skills) |
| [quicknode](skills/quicknode/) | Blockchain infrastructure: RPC, Streams, Webhooks, IPFS, enhanced APIs for 80+ chains, x402 pay-per-request. | [skills.sh](https://skills.sh/quiknode-labs/blockchain-skills/quicknode-skill) |
| [alchemy](skills/alchemy/) | Blockchain data APIs for agents. Node APIs, Token APIs, Webhooks. Pay for compute with x402. | [agents.alchemy.com](https://agents.alchemy.com/) |

### Agent Wallets

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [coinbase-agentic-wallet](skills/coinbase-agentic-wallet/) | Authenticate, send USDC, trade tokens using the `awal` CLI. x402 bazaar, monetize services. | [coinbase/agentic-wallet-skills](https://github.com/coinbase/agentic-wallet-skills) |
| [privy-agentic-wallets](skills/privy-agentic-wallets/) | Create crypto wallets with Privy that AI agents control autonomously with policy-based guardrails. | [privy-io/privy-agentic-wallets-skill](https://github.com/privy-io/privy-agentic-wallets-skill) |
| [sponge-wallet](skills/sponge-wallet/) | Crypto wallet, token swaps, cross-chain bridges, x402 payments for external services (search, image gen, AI). | [wallet.paysponge.com](https://wallet.paysponge.com/skill.md) |
| [clawlett](skills/clawlett/) | OpenClaw skill for autonomous token swaps and Trenches trading via Gnosis Safe + Zodiac Roles. | [Creator-Bid/Clawlett](https://github.com/Creator-Bid/Clawlett) |

### Agent Marketplaces

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [virtual-protocol-acp](skills/virtual-protocol-acp/) | Agent Commerce Protocol CLI: agent wallet, marketplace, token launch, seller runtime, Twitter/X integration. | [Virtual-Protocol/openclaw-acp](https://github.com/Virtual-Protocol/openclaw-acp) |
| [moltlaunch](skills/moltlaunch/) | Onchain coordination: register, accept work, earn reputation, hire agents. Quote-based tasks, trustless escrow on Base. | [moltlaunch.com](https://moltlaunch.com/skill.md) |
| [daydreams-taskmarket](skills/daydreams-taskmarket/) | Open task marketplace. Agents earn USDC. Trustless payments via X402. ERC-8004 identity on Base Mainnet. | [market.daydreams.systems](https://market.daydreams.systems/skill.md) |
| [moltdao](skills/moltdao/) | DAO for AIs. Vote on proposals, create proposals, participate with USDC on Base Sepolia. | [moltdao.app](https://moltdao.app/skill.html) |
| [molten](skills/molten/) | Intent resolution layer. Express what you need, Molten finds the best capability to fulfill it. | [molten.gg](https://molten.gg/skill.md) |

### Token Launch Platforms

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [clanker](skills/clanker/) | Launch tokens via Clanker on Base. | [clanker.world](https://clanker.world) |
| [claunch](skills/claunch/) | Launch tokens on Base for free via Bankr. Agents earn trading fees. | [clawn.ch](https://clawn.ch/skill) |
| [flow](skills/flow/) | Flow protocol: discover auctions, launch tokens, submit bids, claim/exit, deploy liquidity on Base. | [flow.bid](https://www.flow.bid/skill/skill.md) |
| [dx-terminal-pro](skills/dx-terminal-pro/) | Managing autonomous memecoin trading agents on DX Terminal Pro. | [ProjectDXAI/dx-terminal-pro-skill](https://github.com/ProjectDXAI/dx-terminal-pro-skill) |
| [frame](skills/frame/) | Build in public with vibe raising. Launch builder coins, ship products, claim vesting and trading fees. Gas-free on Base. | [frame.fun](https://frame.fun/skill.md) |
| [bankr](skills/bankr/) | Launch tokens, earn trading fees, built-in wallet. Bankr, SIWA, Signals, Botchan, ERC-8004, OnchainKit, and more. | [BankrBot/skills](https://github.com/BankrBot/skills) |

### DeFi Protocols

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [uniswap-ai](skills/uniswap-ai/) | Uniswap-specific AI tools: hooks, trading, CCA auctions, viem integration for Base. | [Uniswap/uniswap-ai](https://github.com/Uniswap/uniswap-ai) |
| [opensea](skills/opensea/) | Query NFT data, trade on Seaport, swap ERC20 tokens across Base and other chains. | [ProjectOpenSea/opensea-skill](https://github.com/ProjectOpenSea/opensea-skill) |
| [elsa](skills/elsa/) | OpenClaw skill for Elsa x402 DeFi API. Micropayments for USDC on Base. | [HeyElsa/elsa-openclaw](https://github.com/HeyElsa/elsa-openclaw) |
| [fluid](skills/fluid/) | Fluid Protocol: lending (ERC-4626 fTokens), vaults (T1–T4). Deposit, borrow, manage positions. No API keys. | [fluid.io](https://fluid.io/skill.md) |

### Social / Messaging

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [farcaster](skills/farcaster/) | Autonomous Farcaster account creation and casting without human intervention. | [rishavmukherji/farcaster-agent](https://github.com/rishavmukherji/farcaster-agent) |
| [agentmail](skills/agentmail/) | API-first email for agents. Create inboxes, send/receive emails, webhooks, agent identity. | [clawhub.ai](https://clawhub.ai/adboio/agentmail) |
| [xmtp](skills/xmtp/) | Secure decentralized messaging between people and agents. XMTP SDK, agent identity. | [xmtp/skills](https://github.com/xmtp/skills) |
| [moltline](skills/moltline/) | Private messaging for molts. Claim handle, DM other molts. XMTP-based. | [moltline.com](https://www.moltline.com/skill.md) |
| [town](skills/town/) | Towns Protocol bots. Build community bots on Base. | [towns-protocol/skills](https://github.com/towns-protocol/skills) |
| [casanova](skills/casanova/) | Social connection simulation for AI agents. Find friends, send requests, share ideas in 3D world. | [cassanovacity.xyz](https://www.cassanovacity.xyz/) |

### AI / LLM Capability

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [clawrouter](skills/clawrouter/) | Agent-native LLM router. Route to right model at right price. 15-dim scoring, 41+ models, zero API keys. | [BlockRunAI/ClawRouter](https://github.com/BlockRunAI/ClawRouter) |
| [heurist-mesh](skills/heurist-mesh/) | Web3/crypto intelligence via 30+ specialized AI agents. Analytics, token data, wallet analysis. | [heurist-network/heurist-mesh-skill](https://github.com/heurist-network/heurist-mesh-skill) |
| [venice-ai](skills/venice-ai/) | Venice AI platform: text, search, embeddings, TTS, image gen, video. Private, uncensored inference. | [clawhub.ai](https://clawhub.ai/jonisjongithub/venice-ai) |

### Gaming / Art Creation

| Skill | Description | Original Link |
| ----- | ----------- | ------------- |
| [remix](skills/remix/) | Best practices for building games on Remix via API-driven agent workflows. | [farworld-labs/remix-skills](https://github.com/farworld-labs/remix-skills) |
| [basebario-agentarcade](skills/basebario-agentarcade/) | Gaming platform for AI agents. Build and publish games as NFTs on Base. Baes SDK. | [aa.baes.app](https://aa.baes.app/_skill/SKILL.md) |
| [basebario-fxclaw](skills/basebario-fxclaw/) | Social platform for AI agents creating generative art with p5.js. | [fxclaw.xyz](https://fxclaw.xyz/SKILL.md) |

## Install

Each skill can be installed individually. Navigate to the skill folder and **read SKILL.md** — follow the instructions to install. The original project's README (see Original Link column) also contains detailed installation steps.

**Example:**
```bash
# Clone this repo
git clone https://github.com/basezh/agent-skills-on-base
cd agent-skills-on-base

# Install a specific skill — read its SKILL.md and follow instructions
cat skills/bankr/SKILL.md
# For Bankr: bun install -g @bankr/cli
```

**Vercel Skills CLI (if supported):**
```bash
npx skills add basezh/agent-skills-on-base --skill building-with-base-account
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License — see [LICENSE](LICENSE).

---

**Base 中文台** · [官方网站](https://www.basezh.org/) | [Twitter](https://x.com/basezh) | [Telegram](https://t.me/basezh) | [Farcaster](https://farcaster.xyz/basezh)
