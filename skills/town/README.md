# Towns Bot Skill

An [Agent Skill](https://agentskills.io) providing comprehensive knowledge for building Towns Protocol bots. Compatible with Claude Code, OpenAI Codex, and other agents supporting the Agent Skills specification.

## Installation

### Claude Code

**Option 1: Via CLI menu**

1. Run `/plugin` in Claude Code
2. Select **Marketplaces** → **Add Marketplace**
3. Enter: `github:towns-protocol/skills`
4. Run `/plugin install towns`

**Option 2: Edit settings directly**

Add to `~/.claude/settings.json`:

```json
{
  "plugins": {
    "marketplaces": ["github:towns-protocol/skills"]
  }
}
```

Then restart Claude Code and run `/plugin install towns`

### OpenAI Codex

**Option 1: Clone to skills directory**

```bash
git clone git@github.com:towns-protocol/skills.git ~/.codex/skills/towns
```

**Option 2: Add to project**

```bash
git clone git@github.com:towns-protocol/skills.git .codex/skills/towns
```

The skill will be available as `$bots` in Codex.

### Other Agents

This skill follows the [Agent Skills specification](https://agentskills.io). Copy the `skills/bots/SKILL.md` file to your agent's skills directory.

## Usage

| Agent | Invocation |
|-------|------------|
| Claude Code | `/towns:bots` |
| OpenAI Codex | `$bots` |

The skill also triggers automatically when working on Towns bot development tasks.

## What's Included

- SDK initialization and configuration
- Event handlers (messages, commands, reactions, tips)
- Messaging API (mentions, threads, attachments, formatting)
- Interactive components (forms, buttons, transactions)
- Blockchain operations (read/write contracts, transaction verification)
- Deployment guides (local dev, Render.com, graceful shutdown)
- Debugging patterns and common mistakes

## Resources

- [Towns Developer Portal](https://app.towns.com/developer)
- [Towns Documentation](https://docs.towns.com/build/bots)
- [@towns-protocol/bot SDK](https://www.npmjs.com/package/@towns-protocol/bot)
- [Agent Skills Specification](https://agentskills.io)
