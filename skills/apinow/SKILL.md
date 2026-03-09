---
name: apinow
version: 1.3.0
description: Discover APIs, fetch endpoint details/examples, execute paid calls, and run multi-step workflows on APINow with x402.
homepage: https://www.apinow.fun
metadata: {"apinow":{"category":"api-marketplace","api_base":"https://www.apinow.fun/api","api_version":"v1","payment_protocol":"x402","chain":"base","required_env":"APINOW_WALLET_PKEY"}}
---

# APINow Agent Skill

Use this skill when the user asks to find APIs, inspect endpoint schemas/examples, pay for API calls, run multi-step workflows, or run with strict API allowlists and spend limits.

## Required Environment

- Required for paid x402 calls: `APINOW_WALLET_PKEY`
- Optional paid fallback: `x-api-key` header with a funded APINow key
- Optional SIWA/CDP/managed signer paths:
  - Privy: `PRIVY_APP_ID`, `PRIVY_APP_SECRET`, `PRIVY_WALLET_ID`
  - Bankr/CDP-style agent wallet: `BANKR_API_KEY`
  - Local private-key signer: `APINOW_WALLET_PKEY`

If a paid call is requested and no valid payment auth is available, stop and ask the user to provide credentials.

## Capabilities

1) Discover APIs
- Semantic search: `POST /api/endpoints/semantic-search`
- Text search/listing: `GET /api/endpoints`
- Catalog listing: `GET /api/catalog`
- Endpoint details/schema: `GET /api/endpoints/{namespace}/{endpoint}/details`
- LLM-oriented examples: `GET /api/endpoints/{namespace}/{endpoint}/vibecode`
- Optional allowlist filters for both search APIs:
  - `allowed_lists`: list slugs to restrict search scope
  - `allowed_endpoints`: explicit endpoint keys (`namespace/endpoint`)

2) Execute paid API calls
- Endpoint invocation: `POST /api/endpoints/{namespace}/{endpoint}`
- Uses x402 (`402 -> sign -> retry`) with `APINOW_WALLET_PKEY`, or API key path.

3) Query lists and enforce list-only mode
- Browse lists: `GET /api/lists`
- Load list details/endpoints and treat as hard allowlist when the user requests list-restricted execution.
- Reject endpoint calls outside the active allowlist.

4) Workflows
- List workflows: `GET /api/workflows`
- Get workflow details: `GET /api/workflows/{workflowId}`
- Run a workflow: `POST /api/workflows/{workflowId}/run`
- Workflows chain multiple x402 endpoints into a DAG pipeline with a single payment + automatic splitting.
- Each workflow has: nodes (endpoint references with dependency graph), totalPrice (USDC), and splits (payment distribution to endpoint owners + creator).
- Optional query params for listing: `creator`, `status` (active|draft|all), `limit`

5) Spend controls
- Support request-scoped and session/day controls:
  - `max_per_query_usd`
  - `max_per_day_usd`
- Before each paid call, estimate/check endpoint price from details and enforce caps.
- If expected cost exceeds cap, stop and ask for confirmation or updated limits.

6) Signer support
- Private key (`APINOW_WALLET_PKEY`) default path.
- Managed signers (Privy/Bankr/CDP-style wallets) for SIWA/x402 setups where configured.

## Execution Policy (must follow)

1. Never execute paid calls without payment credentials.
2. If allowlist mode is enabled, only call endpoints present in the selected list(s).
3. If allowlist mode is enabled, apply the same restrictions to discovery (`/api/endpoints` and `/api/endpoints/semantic-search`) before ranking/returning results.
4. Enforce `max_per_query_usd` and `max_per_day_usd` before every paid invocation.
5. Always fetch endpoint details before first call in a workflow to confirm method, params, and price.
6. Prefer returning:
   - endpoint selected
   - price
   - auth method used (wallet or API key)
   - response payload summary

## Recommended Workflow

1. Discover
```bash
curl -X POST https://www.apinow.fun/api/endpoints/semantic-search \
  -H "Content-Type: application/json" \
  -d '{"query":"summarize long text","limit":5,"allowed_lists":["best-ai-tools"],"allowed_endpoints":["openai/chat"]}'

curl "https://www.apinow.fun/api/endpoints?search=summarize&sortBy=popular&allowed_lists=best-ai-tools&allowed_endpoints=openai/chat"
```

2. Inspect details
```bash
curl https://www.apinow.fun/api/endpoints/openai/chat/details
curl https://www.apinow.fun/api/endpoints/openai/chat/vibecode
```

3. Execute (wallet path)
```javascript
import { createClient } from "apinow-sdk";

const apinow = createClient({
  privateKey: process.env.APINOW_WALLET_PKEY,
});

const result = await apinow.call("/api/endpoints/openai/chat", {
  method: "POST",
  body: { prompt: "Summarize this document" },
});
```

4. Execute (API key path)
```bash
curl -X POST https://www.apinow.fun/api/endpoints/openai/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"prompt":"Summarize this document"}'
```

5. Browse workflows
```bash
curl "https://www.apinow.fun/api/workflows?status=active&limit=10"
curl https://www.apinow.fun/api/workflows/90931d9c8fb94df9
```

6. Run a workflow (wallet path)
```javascript
import { createClient } from "apinow-sdk";

const apinow = createClient({
  privateKey: process.env.APINOW_WALLET_PKEY,
});

const result = await apinow.runWorkflow("90931d9c8fb94df9", {
  query: "birthday gift ideas for a friend who loves cooking",
});
```

7. Run a workflow (cURL)
```bash
curl -X POST 'https://www.apinow.fun/api/workflows/90931d9c8fb94df9/run' \
  -H 'Content-Type: application/json' \
  -H 'x-admin-key: YOUR_ADMIN_KEY' \
  -d '{"query": "hello world"}'
```

8. Run a workflow (CLI)
```bash
APINOW_WALLET_PKEY=0x... npx apinow run-workflow 90931d9c8fb94df9 -d '{"query":"birthday gift ideas"}'
```

## Workflow Example — "Tarot Gift"

A real workflow on APINow: [Tarot Gift](https://www.apinow.fun/workflows/90931d9c8fb94df9)

- **2 nodes**: `gg402/gift_recommender` → `ai-factory/tarot_card_reading`
- **Cost**: $0.05 USDC per call
- **Payment split**: 20% to gift_recommender owner, 16% to tarot_card_reading owner, 64% to workflow creator
- **Input**: `{ "query": "birthday gift ideas" }`
- **DAG**: gift_recommender runs first, its output feeds into tarot_card_reading

```javascript
const apinow = createClient({ privateKey: process.env.APINOW_WALLET_PKEY });

const details = await apinow.getWorkflow("90931d9c8fb94df9");
console.log(details.name);        // "Tarot Gift"
console.log(details.totalPrice);   // "0.05"
console.log(details.graph.nodes);  // [{id:"gift_recommender",...}, {id:"tarot_card_reading",...}]

const result = await apinow.runWorkflow("90931d9c8fb94df9", {
  query: "birthday gift ideas for a friend who loves cooking",
});
console.log(result);
```

## List-Restricted Mode Template

When user asks for list-only querying, keep this state in the run:

```json
{
  "allowed_lists": ["best-ai-tools"],
  "allowed_endpoints": ["openai/chat", "gg402/horoscope"],
  "enforce_for_search": true,
  "enforce_for_semantic_search": true,
  "max_per_query_usd": 0.02,
  "max_per_day_usd": 1.0,
  "spent_today_usd": 0.00
}
```

Enforcement:
- Block call if endpoint is not in `allowed_endpoints`.
- For `GET /api/endpoints`, include `allowed_lists` / `allowed_endpoints` query filters.
- For `POST /api/endpoints/semantic-search`, include `allowed_lists` / `allowed_endpoints` in JSON body.
- Block call if endpoint price > `max_per_query_usd`.
- Block call if `spent_today_usd + endpoint_price > max_per_day_usd`.

## Config File (recommended)

Store this beside your installed skill as `apinow.config.json`:

```json
{
  "allowed_lists": ["best-ai-tools"],
  "allowed_endpoints": [],
  "enforce_for_search": true,
  "enforce_for_semantic_search": true,
  "max_per_query_usd": 0.02,
  "max_per_day_usd": 1.0
}
```

Usage notes:
- `allowed_lists` and `allowed_endpoints` are merged (union).
- If both are empty, discovery spans all public endpoints.
- Keep `enforce_for_search` and `enforce_for_semantic_search` true to avoid untrusted endpoints during discovery.

## Cross-Platform Install / Use

### Cursor
- Project skill location: `.cursor/skills/apinow/SKILL.md` or `.agents/skills/apinow/SKILL.md`
- Quick setup:
```bash
mkdir -p .cursor/skills/apinow && curl -fsSL https://www.apinow.fun/skill.md -o .cursor/skills/apinow/SKILL.md && cat > .cursor/skills/apinow/apinow.config.json <<'EOF'
{"allowed_lists":["best-ai-tools"],"allowed_endpoints":[],"enforce_for_search":true,"enforce_for_semantic_search":true}
EOF
```

### GitHub Copilot (agent skills)
- Project location: `.github/skills/apinow/SKILL.md` (or `.claude/skills/apinow/SKILL.md`)
- Quick setup:
```bash
mkdir -p .github/skills/apinow && curl -fsSL https://www.apinow.fun/skill.md -o .github/skills/apinow/SKILL.md && cat > .github/skills/apinow/apinow.config.json <<'EOF'
{"allowed_lists":["best-ai-tools"],"allowed_endpoints":[],"enforce_for_search":true,"enforce_for_semantic_search":true}
EOF
```

### Claude Code
- Project location: `.claude/skills/apinow/SKILL.md`
- Global location: `~/.claude/skills/apinow/SKILL.md`
- Quick setup:
```bash
mkdir -p .claude/skills/apinow && curl -fsSL https://www.apinow.fun/skill.md -o .claude/skills/apinow/SKILL.md && cat > .claude/skills/apinow/apinow.config.json <<'EOF'
{"allowed_lists":["best-ai-tools"],"allowed_endpoints":[],"enforce_for_search":true,"enforce_for_semantic_search":true}
EOF
```

### OpenClaw
- Workspace location: `skills/apinow/SKILL.md`
- Global location: `~/.openclaw/skills/apinow/SKILL.md`
- Quick setup:
```bash
mkdir -p skills/apinow && curl -fsSL https://www.apinow.fun/skill.md -o skills/apinow/SKILL.md && cat > skills/apinow/apinow.config.json <<'EOF'
{"allowed_lists":["best-ai-tools"],"allowed_endpoints":[],"enforce_for_search":true,"enforce_for_semantic_search":true}
EOF
```

## Notes

- Keep `APINOW_WALLET_PKEY` as canonical required env var for paid wallet flow.
- If using managed signers (Privy/Bankr/CDP), ensure those env vars are present before executing.

## Links

- Homepage: https://www.apinow.fun
- Skill file: https://www.apinow.fun/skill.md
- AI Skills page: https://www.apinow.fun/ai-skills
- SDK: https://www.npmjs.com/package/apinow-sdk
