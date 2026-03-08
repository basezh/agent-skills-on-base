---
name: xmtp-agent
description: >
 Connect a running agent (OpenClaw, Claude Code, LangChain, custom Python, any agent runtime) to XMTP messaging so people can DM it and get responses that use the agent's full capabilities — tools, memory, session context. Provides the complete bridge pattern: XMTP CLI setup, identity registration, streaming incoming messages, routing through your agent backend, and sending replies back. Use this skill whenever someone wants to make their agent reachable over XMTP, write a bridge or listener script between an agent process and XMTP, set up xmtp init and stream-all-messages for an agent, have their agent respond to XMTP conversations continuously, wire any agent runtime to the XMTP open messaging network, or pipe XMTP messages through stdin/stdout to an agent process.
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

**Install:** Read the full [xmtp-agent SKILL](https://github.com/xmtp/skills/blob/main/xmtp-agent/SKILL.md) and follow the instructions. Clone [xmtp/skills](https://github.com/xmtp/skills) or add to your agent's skills directory.

**Source:** [xmtp/skills](https://github.com/xmtp/skills)
