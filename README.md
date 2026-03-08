# Agent Skills on Base

A curated collection of [Agent Skills](https://agentskills.io) for building AI agents on [Base](https://base.org). These skills enable agents to connect to Base infrastructure, manage wallets, launch tokens, participate in agent marketplaces, interact with DeFi protocols, and more.

## Install

```bash
# Install with Vercel's Skills CLI
npx skills add basezh/agent-skills-on-base

# Or install individual skills
npx skills add basezh/agent-skills-on-base --skill building-with-base-account
```

**Bankr-style install:**
```
> install the [skill-name] skill from https://github.com/basezh/agent-skills-on-base/tree/main/skills/[skill-name]
```

**Manual clone:**
```bash
git clone https://github.com/basezh/agent-skills-on-base
```

## Available Skills

### Infrastructure

| Skill | Description |
| ----- | ----------- |
| [building-with-base-account](skills/building-with-base-account/) | Base Account SDK for authentication and payments: SIWB, Base Pay, Paymasters, Sub Accounts, Spend Permissions. |
| [connecting-to-base-network](skills/connecting-to-base-network/) | Base Mainnet and Sepolia network configuration, RPC endpoints, chain IDs, explorer URLs. |
| [deploying-contracts-on-base](skills/deploying-contracts-on-base/) | Deploy and verify contracts on Base with Foundry, plus troubleshooting guidance. |
| [running-a-base-node](skills/running-a-base-node/) | Production node setup, hardware requirements, networking ports, syncing guidance. |
| [converting-minikit-to-farcaster](skills/converting-minikit-to-farcaster/) | Migrate Mini Apps from MiniKit (OnchainKit) to native Farcaster SDK. |
| [quicknode](skills/quicknode/) | Blockchain infrastructure: RPC, Streams, Webhooks, IPFS, enhanced APIs for 80+ chains, x402 pay-per-request. |
| [alchemy](skills/alchemy/) | Blockchain data APIs for agents. Node APIs, Token APIs, Webhooks. Pay for compute with x402. |

### Agent Wallets

| Skill | Description |
| ----- | ----------- |
| [coinbase-agentic-wallet](skills/coinbase-agentic-wallet/) | Authenticate, send USDC, trade tokens using the `awal` CLI. x402 bazaar, monetize services. |
| [privy-agentic-wallets](skills/privy-agentic-wallets/) | Create crypto wallets with Privy that AI agents control autonomously with policy-based guardrails. |
| [sponge-wallet](skills/sponge-wallet/) | Crypto wallet, token swaps, cross-chain bridges, x402 payments for external services (search, image gen, AI). |
| [clawlett](skills/clawlett/) | OpenClaw skill for autonomous token swaps and Trenches trading via Gnosis Safe + Zodiac Roles. |

### Agent Marketplaces

| Skill | Description |
| ----- | ----------- |
| [virtual-protocol-acp](skills/virtual-protocol-acp/) | Agent Commerce Protocol CLI: agent wallet, marketplace, token launch, seller runtime, Twitter/X integration. |
| [moltlaunch](skills/moltlaunch/) | Onchain coordination: register, accept work, earn reputation, hire agents. Quote-based tasks, trustless escrow on Base. |
| [daydreams-taskmarket](skills/daydreams-taskmarket/) | Open task marketplace. Agents earn USDC. Trustless payments via X402. ERC-8004 identity on Base Mainnet. |
| [moltdao](skills/moltdao/) | DAO for AIs. Vote on proposals, create proposals, participate with USDC on Base Sepolia. |
| [molten](skills/molten/) | Intent resolution layer. Express what you need, Molten finds the best capability to fulfill it. |

### Token Launch Platforms

| Skill | Description |
| ----- | ----------- |
| [clanker](skills/clanker/) | Launch tokens via Clanker on Base. |
| [claunch](skills/claunch/) | Launch tokens on Base for free via Bankr. Agents earn trading fees. |
| [flow](skills/flow/) | Flow protocol: discover auctions, launch tokens, submit bids, claim/exit, deploy liquidity on Base. |
| [dx-terminal-pro](skills/dx-terminal-pro/) | Managing autonomous memecoin trading agents on DX Terminal Pro. |
| [frame](skills/frame/) | Build in public with vibe raising. Launch builder coins, ship products, claim vesting and trading fees. Gas-free on Base. |
| [bankr](skills/bankr/) | Launch tokens, earn trading fees, built-in wallet. Bankr, SIWA, Signals, Botchan, ERC-8004, OnchainKit, and more. |

### DeFi Protocols

| Skill | Description |
| ----- | ----------- |
| [uniswap-ai](skills/uniswap-ai/) | Uniswap-specific AI tools: hooks, trading, CCA auctions, viem integration for Base. |
| [opensea](skills/opensea/) | Query NFT data, trade on Seaport, swap ERC20 tokens across Base and other chains. |
| [elsa](skills/elsa/) | OpenClaw skill for Elsa x402 DeFi API. Micropayments for USDC on Base. |
| [fluid](skills/fluid/) | Fluid Protocol: lending (ERC-4626 fTokens), vaults (T1–T4). Deposit, borrow, manage positions. No API keys. |

### Social / Messaging

| Skill | Description |
| ----- | ----------- |
| [farcaster](skills/farcaster/) | Autonomous Farcaster account creation and casting without human intervention. |
| [agentmail](skills/agentmail/) | API-first email for agents. Create inboxes, send/receive emails, webhooks, agent identity. |
| [xmtp](skills/xmtp/) | Secure decentralized messaging between people and agents. XMTP SDK, agent identity. |
| [moltline](skills/moltline/) | Private messaging for molts. Claim handle, DM other molts. XMTP-based. |
| [town](skills/town/) | Towns Protocol bots. Build community bots on Base. |
| [casanova](skills/casanova/) | Social connection simulation for AI agents. Find friends, send requests, share ideas in 3D world. |

### AI / LLM Capability

| Skill | Description |
| ----- | ----------- |
| [clawrouter](skills/clawrouter/) | Agent-native LLM router. Route to right model at right price. 15-dim scoring, 41+ models, zero API keys. |
| [heurist-mesh](skills/heurist-mesh/) | Web3/crypto intelligence via 30+ specialized AI agents. Analytics, token data, wallet analysis. |
| [venice-ai](skills/venice-ai/) | Venice AI platform: text, search, embeddings, TTS, image gen, video. Private, uncensored inference. |

### Gaming / Art Creation

| Skill | Description |
| ----- | ----------- |
| [remix](skills/remix/) | Best practices for building games on Remix via API-driven agent workflows. |
| [basebario-agentarcade](skills/basebario-agentarcade/) | Gaming platform for AI agents. Build and publish games as NFTs on Base. Baes SDK. |
| [basebario-fxclaw](skills/basebario-fxclaw/) | Social platform for AI agents creating generative art with p5.js. |

## Usage

Skills are automatically available once installed. The agent uses them when relevant tasks are detected.

**Examples:**

```
Deploy my contract to Base Sepolia
```

```
Launch a token on Base using Bankr
```

```
Find work on the Daydreams Taskmarket
```

```
Swap 0.02 ETH to USDC on Base
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License — see [LICENSE](LICENSE).

---

[Base](https://base.org) · [Agent Skills Spec](https://agentskills.io)
