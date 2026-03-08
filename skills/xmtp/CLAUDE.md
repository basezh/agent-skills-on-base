# Working on Skills

Guidelines for developing and maintaining Claude Code skills in this repository.

## Skill Structure

A skill is a folder with a `SKILL.md` file containing YAML frontmatter and markdown instructions:

```
skill-name/
└── SKILL.md    # Instructions and metadata
```

Complex skills may include a `references/` folder for detailed lookup documents, but utility skills often need only the SKILL.md.

## Documentation Lookup Pattern

When skills need to query external documentation (like XMTP docs), follow this pattern:

### The Problem

Large documentation files (500KB+) are too big for WebFetch to reliably search. Content gets truncated or missed.

### The Solution

Use a two-step approach:

1. **Find the right page** via an index file (e.g., `llms.txt`)
2. **Fetch that specific page** for complete content

```
# Step 1: Find the page
WebFetch({
  url: "https://docs.example.org/llms.txt",
  prompt: "Find the page URL for [topic]"
})

# Step 2: Fetch complete content
WebFetch({
  url: "https://docs.example.org/[path-from-step-1]",
  prompt: "Extract [specific feature] with code examples"
})
```

### Implementation

The `xmtp-docs` skill in `/xmtp-docs` implements this pattern for XMTP documentation. Reference it when building skills that need XMTP SDK lookups.

## Writing Skills

### SKILL.md Frontmatter

```yaml
---
name: skill-name
description: >
  What the skill does and when to use it.
  Use when: (1) condition one, (2) condition two.
---
```

### Guidelines

- **Keep it lean** - SKILL.md should be under 500 lines
- **Don't hardcode SDK methods** - Methods change; describe purposes instead
- **Avoid MCP in skills** - Use WebFetch for documentation lookups
- **Test lookups** - Verify queries return useful results before committing

## Common Mistakes

1. **Using llms-full.txt directly** - Too large for reliable WebFetch searches. Use the index + specific pages.

2. **Hardcoding method names** - Say "How to create a client" not `Client.create()`. SDK methods change.

3. **Assuming training data is current** - Always look up SDK patterns from documentation.
