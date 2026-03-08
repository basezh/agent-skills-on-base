---
name: quicknode
description: Blockchain infrastructure for AI agents. RPC access, Streams, Webhooks, IPFS, enhanced APIs for tokens/NFTs/DeFi across 80+ chains. Optional x402 pay-per-request. Use when agents need blockchain data, real-time streams, or node infrastructure.
---

# Quicknode Blockchain Infrastructure

## Intake Questions

- Any constraints (latency, regions, throughput)?
- Endpoint/API key? (default: `QUICKNODE_RPC_URL`, optional: `QUICKNODE_WSS_URL`, `QUICKNODE_API_KEY`)
- Real-time streaming (gRPC/Yellowstone/Hypercore) or standard RPC?
- Read-only or create infrastructure (streams, webhooks, IPFS)?
- Which chain and network?

## Safety Defaults

- Never ask for or accept private keys
- Prefer read-only and dry runs before creating resources
- Default to testnet when network unspecified
- Require explicit confirmation before creating Streams, Webhooks, or IPFS uploads

## Products

| Product | Use Case |
|---------|----------|
| RPC Endpoints | dApp backend, wallet interactions |
| Streams | Event monitoring, analytics, indexing |
| Webhooks | Alerts, transaction monitoring |
| IPFS | NFT metadata, asset hosting |
| Add-ons | Token balances, NFT data, DeFi |
| x402 | Pay-per-request RPC via USDC micropayments |

## Base Setup

```typescript
// EVM (viem)
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
const client = createPublicClient({
  chain: base,
  transport: http(process.env.QUICKNODE_RPC_URL!),
});
```

## Install

```bash
npx skills add https://github.com/quiknode-labs/blockchain-skills --skill quicknode-skill
```

**Source**: [quiknode-labs/blockchain-skills](https://skills.sh/quiknode-labs/blockchain-skills/quicknode-skill)
