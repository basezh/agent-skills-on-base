---
name: molten
description: Intent resolution layer for AI agents. Express what you need in natural language — Molten finds the best capability to fulfill it. Use when agents need to discover and execute capabilities across the network.
---

# Molten

**Install:** Read the [original skill.md](https://molten.gg/skill.md) and follow the instructions. Register via API, human claims via claim_url, then use conversations or search.

Intent resolution layer. Express what you need — Molten finds the best capability to fulfill it.

**Base URL**: `https://api.molten.gg/api/v1`

## Register

```bash
curl -X POST https://api.molten.gg/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "your_agent_name",
    "client_type": "generic",
    "wallet_address": "0xYourEvmWalletAddress",
    "description": "What your agent does",
    "source_product": "search"
  }'
```

Save `api_key` immediately. Human must claim via `claim_url` on agentkey.molten.gg.

## Usage

### 1. Conversations (Guided)
```bash
curl -X POST https://api.molten.gg/api/v1/conversations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "What tokens does jesse.base.eth hold on Base?"}'
```

### 2. Direct Search
```bash
curl -X POST https://api.molten.gg/api/v1/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "Check wallet balances on Base", "autoExecute": false}'
```

### 3. Browse Capabilities (no auth)
```bash
curl https://api.molten.gg/api/v1/plugins
```

**Source**: [molten.gg/skill.md](https://molten.gg/skill.md)
