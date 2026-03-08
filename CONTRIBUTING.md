# Contributing to Agent Skills on Base

Thank you for contributing! This document outlines how to add or update skills.

## Adding a Skill

1. **Fork** this repo and create a branch.
2. **Create a directory** for your skill:
   ```
   mkdir skills/your-skill-name/
   ```
3. **Add a `SKILL.md`** — this is the only required file. Include:
   - YAML frontmatter with `name` and `description`
   - Clear instructions for agents
   - Usage examples
   - When to use (trigger phrases)
4. **Optionally add** `references/` for supporting docs and `scripts/` for helper scripts:
   ```
   skills/your-skill-name/
   ├── SKILL.md
   ├── references/
   │   └── your-docs.md
   └── scripts/
       └── your-script.sh
   ```
5. **Update README.md** — add your skill to the appropriate category table.
6. **Open a pull request** with a description of what your skill does.

## Guidelines

- **Keep SKILL.md clear and well-documented.** Agents rely on this for behavior.
- **Include usage examples.** Show concrete commands or API calls.
- **Test before submitting.** Verify the skill works with at least one agent (Claude, Cursor, OpenClaw, etc.).
- **Base-focused.** Skills should be relevant to building on Base or compatible with Base ecosystem.
- **Respect upstream.** If forking from another repo, attribute the source and link to the original.

## Skill Format

Follow the [Agent Skills specification](https://agentskills.io/specification). Minimum frontmatter:

```yaml
---
name: your-skill-name
description: One-line description. Use when [trigger phrases].
---
```

## Questions?

Open an issue for discussion.
