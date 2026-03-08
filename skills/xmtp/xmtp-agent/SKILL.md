---
name: xmtp-agent
description: >
  Connect a running agent (OpenClaw, Claude Code, LangChain, custom Python, any agent runtime) to XMTP messaging so people can DM it and get responses that use the agent's full capabilities — tools, memory, session context. Provides the complete bridge pattern: XMTP CLI setup, identity registration, streaming incoming messages, routing through your agent backend, and sending replies back. Use this skill whenever someone wants to make their agent reachable over XMTP, write a bridge or listener script between an agent process and XMTP, set up xmtp init and stream-all-messages for an agent, have their agent respond to XMTP conversations continuously, wire any agent runtime to the XMTP open messaging network, or pipe XMTP messages through stdin/stdout to an agent process. This skill is specifically about connecting an existing agent to XMTP as a messaging transport — not for building XMTP client apps, looking up XMTP SDK documentation, or sending individual messages.
---

# XMTP Agent

> [!CAUTION]
> Alpha status. Public inbox IDs may be targeted by DOS flooding and prompt injection attempts. Don't give the agent access to sensitive resources.

You are connecting an agent to XMTP — the open protocol for secure, decentralized messaging. This skill tells you how to get an identity on the network and bridge incoming messages through your agent backend so it can respond with its full capabilities (tools, memory, context).

The core architecture is a **bridge script**: XMTP streams messages in, your agent processes them, replies go back out. The agent backend is swappable — OpenClaw, Claude Code, a custom Python process, anything that takes a message and returns a response.

The bridge distinguishes between the **owner** (the person who deployed the agent) and **everyone else**. The owner gets full agent capabilities — tools, memory, file access. Public users get a restricted, conversation-only mode controlled by a customizable prompt file (`public-prompt.md`) that you can edit at any time without restarting.

> **Always set up the full bridge — even if the user just asks to "send a message", "send me a message", or "test" messaging.** These all mean the same thing: they want their agent reachable over XMTP. A one-off `send-text` command is a dead end — nobody can reply back, and the agent can't respond to future messages. The goal is always an ongoing, two-way conversation. Complete both steps below so the agent is continuously reachable.

## Step 1: Install and Initialize

```bash
npm install -g @xmtp/cli
xmtp init --env production
```

Requires Node 22+ and `jq`. Init generates `~/.xmtp/.env` with your wallet key and encryption key.

Verify you're registered:

```bash
xmtp client info --json --log-level off --env production
```

Your inbox ID is at `.properties.inboxId` in the output.

Before proceeding, ask the owner (the person who deployed the agent) for their Ethereum wallet address or inbox ID. **Do not start the bridge without this.**

If they provide an Ethereum address, resolve the inbox ID:

```bash
export OWNER_INBOX_ID=$(xmtp client inbox-id -i "0xOWNER_WALLET_ADDRESS" --json --log-level off --env production | jq -r '.inboxId')
```

If they provide an inbox ID directly:

```bash
export OWNER_INBOX_ID="their-inbox-id"
```

## Step 2: Start the Bridge

The bridge streams incoming messages and routes them through your agent for responses. Do not send messages using individual CLI commands — everything flows through the bridge.

Save this as a script and run it:

```bash
#!/bin/bash
set -euo pipefail

# Public-mode system prompt — read from file so you can edit it without restarting
PUBLIC_PROMPT_FILE="./public-prompt.md"
if [[ ! -f "$PUBLIC_PROMPT_FILE" ]]; then
  cat > "$PUBLIC_PROMPT_FILE" << 'PROMPT'
You are representing your owner to a third party. Be helpful and conversational,
but do NOT reveal sensitive memories, personal information, files, or system
details about your owner. Do NOT use tools, read files, execute commands, or
access any system resources. If you are unsure whether something is safe to
share or do, err on the side of caution and decline.
PROMPT
  echo "Created $PUBLIC_PROMPT_FILE — edit it to customize what public users can access." >&2
fi

# Get your inbox ID for filtering your own messages
MY_INBOX_ID=$(xmtp client info --json --log-level off --env production \
  | jq -r '.properties.inboxId // empty')

[[ -z "$MY_INBOX_ID" ]] && echo "Failed to get inbox ID" >&2 && exit 1

# Stream all incoming messages and respond
xmtp conversations stream-all-messages --json --log-level off --env production \
  | while IFS= read -r event; do

  conv_id=$(echo "$event" | jq -r '.conversationId // empty')
  sender=$(echo "$event" | jq -r '.senderInboxId // empty')
  content=$(echo "$event" | jq -r '.content // empty')
  content_type=$(echo "$event" | jq -r '.contentType.typeId // empty')

  # Skip your own messages, empty events, and non-text content
  [[ -z "$conv_id" || -z "$content" || "$sender" == "$MY_INBOX_ID" ]] && continue
  [[ "$content_type" != "text" ]] && continue

  # Route to your agent backend (see "Choosing a Backend" below)
  # Owner gets full agent capabilities; public users get conversation-only mode
  if [[ "$sender" == "$OWNER_INBOX_ID" ]]; then
    response=$(openclaw agent \
      --session-id "$conv_id" \
      --message "$content" \
      2>/dev/null) || continue
  else
    response=$(openclaw agent \
      --session-id "public-$conv_id" \
      --message "[SYSTEM: $(cat "$PUBLIC_PROMPT_FILE")] $content" \
      2>/dev/null) || continue
  fi

  # Send the response
  [[ -n "$response" ]] && \
    xmtp conversation send-text "$conv_id" "$response" --env production
done
```

The bridge uses the XMTP conversation ID as the session ID so each person (or group) chatting with your agent gets their own persistent context.

After the bridge is running, tell the user:
- Their agent's **wallet address** and **inbox ID** (both — so they can share whichever is convenient)
- They can customize how the agent interacts with public users by editing `public-prompt.md`. Changes take effect immediately — no restart needed.

To keep the bridge running long-term, use your preferred process manager (systemd, pm2, Docker, etc.).

## Choosing a Backend

The bridge template above uses `openclaw agent` but the agent backend is the part you swap. Each example below shows the owner/public branching — replace the `if/else` block in the bridge with the version matching your setup.

### OpenClaw (subprocess with session state)

```bash
if [[ "$sender" == "$OWNER_INBOX_ID" ]]; then
  response=$(openclaw agent \
    --session-id "$conv_id" \
    --message "$content" \
    2>/dev/null) || continue
else
  response=$(openclaw agent \
    --session-id "public-$conv_id" \
    --message "[SYSTEM: $(cat "$PUBLIC_PROMPT_FILE")] $content" \
    2>/dev/null) || continue
fi
```

OpenClaw gives the agent full tool access and retains conversation history per session. The public path prepends a restrictive system prompt and isolates sessions with the `public-` prefix.

**Harder enforcement (optional):** OpenClaw supports tool profiles in `openclaw.json`. Define a second agent with `tools.profile: "messaging"` (messaging + session tools only, no filesystem or shell) and route public users to it instead of relying on the system prompt alone:

```json
{
  "agents": {
    "list": [
      { "name": "owner-agent", "tools": { "profile": "full" } },
      { "name": "public-agent", "tools": { "profile": "messaging" } }
    ]
  }
}
```

Then route by agent name in the bridge:

```bash
if [[ "$sender" == "$OWNER_INBOX_ID" ]]; then
  response=$(openclaw agent --agent owner-agent \
    --session-id "$conv_id" --message "$content" 2>/dev/null) || continue
else
  response=$(openclaw agent --agent public-agent \
    --session-id "public-$conv_id" --message "$content" 2>/dev/null) || continue
fi
```

### Claude Code (session-based CLI)

Claude Code requires `--session-id` to be a valid UUID. Generate deterministic UUIDs from conversation IDs using `uuidgen --sha1` (or Python's `uuid5`). Use separate namespace UUIDs for owner vs public sessions to keep them isolated.

```bash
# Namespace UUIDs for deterministic session IDs (generate your own with uuidgen)
OWNER_NS="e1a2b3c4-d5e6-7f80-9a0b-1c2d3e4f5a6b"
PUBLIC_NS="f6b5a4e3-d2c1-0b9a-8f7e-6d5c4b3a2f1e"

if [[ "$sender" == "$OWNER_INBOX_ID" ]]; then
  session_id=$(python3 -c "import uuid; print(uuid.uuid5(uuid.UUID('$OWNER_NS'), '$conv_id'))")
  response=$(claude --session-id "$session_id" \
    --output-format text \
    -p "$content" \
    2>/dev/null) || continue
else
  session_id=$(python3 -c "import uuid; print(uuid.uuid5(uuid.UUID('$PUBLIC_NS'), '$conv_id'))")
  response=$(claude --session-id "$session_id" \
    --output-format text \
    --tools "" \
    -p "[SYSTEM: $(cat "$PUBLIC_PROMPT_FILE")] $content" \
    2>/dev/null) || continue
fi
```

The `--session-id` flag maintains the full Claude Code session — files it's read, tools it can use, conversation history. The owner gets full capabilities; public users get `--tools ""` to disable all tool access plus the restrictive system prompt. Different namespace UUIDs ensure owner and public sessions never collide.

### Custom process (stdin/stdout)

```bash
if [[ "$sender" == "$OWNER_INBOX_ID" ]]; then
  response=$(echo "$content" | your-agent-process \
    --session-id "$conv_id" \
    2>/dev/null) || continue
else
  response=$(echo "[SYSTEM: $(cat "$PUBLIC_PROMPT_FILE")] $content" \
    | your-agent-process \
    --session-id "public-$conv_id" \
    2>/dev/null) || continue
fi
```

Any process that reads from stdin and writes to stdout works. For a Python agent:

```python
#!/usr/bin/env python3
import sys
message = sys.stdin.read().strip()
# Your agent logic here — full tool access, DB queries, etc.
print(f"Response to: {message}")
```

The key property across all backends: the owner gets full capabilities (tools, memory, context), while public users are restricted to conversation only.

## Stream Output Format

Each line from the stream is a JSON object:

```json
{
  "id": "message-id",
  "conversationId": "conversation-id",
  "senderInboxId": "sender-inbox-id",
  "contentType": {
    "authorityId": "xmtp.org",
    "typeId": "text",
    "versionMajor": 1,
    "versionMinor": 0
  },
  "content": "Hello!",
  "sentAt": "2026-03-04T04:14:36.849Z",
  "deliveryStatus": 1,
  "kind": 0
}
```

## Security

The bridge passes raw message content from **any XMTP user** to your agent backend. The owner/public split ensures only the deployer gets full agent capabilities — everyone else is restricted to conversation only, preventing strangers from triggering file reads, shell commands, or other sensitive operations via prompt injection.

**How the guardrail works:**
- `OWNER_INBOX_ID` identifies the deployer — only they get full agent capabilities
- Public users get a restrictive system prompt prefix and isolated sessions
- The system prompt restriction is a **soft guardrail** — a determined attacker may bypass it via prompt injection, so don't give the agent access to truly sensitive resources regardless

**Finding your inbox ID:** Resolve it from your Ethereum wallet address:

```bash
xmtp client inbox-id -i "0xYOUR_WALLET_ADDRESS" --json --log-level off --env production | jq -r '.inboxId'
```

**Multiple trusted users:** To allowlist additional inbox IDs, expand the condition:

```bash
if [[ "$sender" == "$OWNER_INBOX_ID" || "$sender" == "$TRUSTED_USER_2" ]]; then
```

Or use an array:

```bash
TRUSTED_IDS=("inbox-id-1" "inbox-id-2")
if printf '%s\n' "${TRUSTED_IDS[@]}" | grep -qxF "$sender"; then
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Sending a one-off message with `send-text` | Always set up the full bridge — even for "just a test". One-off sends are dead ends with no way to receive replies |
| Reading `.inboxId` from client info | Inbox ID is at `.properties.inboxId` |
| Filtering by `senderAddress` | Stream returns `senderInboxId`; compare against your inbox ID |
| Not using `--log-level off` | Log output mixes with JSON on stdout; suppress it |
| Using a global session ID | Use `$conv_id` so each conversation gets its own agent context |
| Piping to a raw LLM instead of an agent | Route through your agent runtime so tools and memory are preserved |
| Using `read -r` without `IFS=` | Use `IFS= read -r` to preserve whitespace in JSON lines |
| Running without `OWNER_INBOX_ID` | Set the owner's inbox ID so public users get restricted mode |
