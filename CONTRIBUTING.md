# Contributing to Agent Skills on Base

Thank you for your interest in contributing to **Agent Skills on Base**! This repository curates the best agent skills for building AI agents on [Base](https://base.org). Your contributions help grow the onchain agent ecosystem.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Adding a New Skill](#adding-a-new-skill)
  - [Updating Existing Skills](#updating-existing-skills)
  - [Improving Documentation](#improving-documentation)
  - [Reporting Issues](#reporting-issues)
- [Skill Submission Guidelines](#skill-submission-guidelines)
  - [Skill Requirements](#skill-requirements)
  - [File Structure](#file-structure)
  - [Frontmatter Format](#frontmatter-format)
- [Development Workflow](#development-workflow)
- [Review Process](#review-process)

## Code of Conduct

This project adheres to a standard of respectful, constructive collaboration. Please:

- Be respectful and inclusive in all interactions
- Provide constructive feedback
- Focus on what's best for the agent ecosystem
- Show empathy towards other contributors

## How Can I Contribute?

### Adding a New Skill

We welcome new skill submissions that expand the capabilities of AI agents on Base. To add a new skill:

1. **Fork the repository** and create a new branch
2. **Create your skill directory** under `skills/{your-skill-name}/`
3. **Add your SKILL.md** file with proper frontmatter (see [Frontmatter Format](#frontmatter-format))
4. **Update the main README.md** to include your skill in the appropriate category
5. **Submit a Pull Request** with a clear description

#### Skill Categories

Skills are organized into the following categories:

- **Chain / Data Infra**: RPC providers, node services, data APIs
- **Wallet**: Agentic wallets, wallet infrastructure
- **Token Markets**: Token launch platforms, DEXs, NFT marketplaces
- **DeFi/Trading**: Lending, borrowing, trading, yield protocols
- **Social**: Farcaster, XMTP, social graph protocols
- **Creation**: Content creation, media, generative AI
- **Agent Infra**: Agent frameworks, orchestration, task markets

### Updating Existing Skills

If you notice outdated information about an existing skill:

1. Fork the repository
2. Update the relevant `skills/{skill-name}/SKILL.md` file
3. Update the main README.md if the description has changed
4. Submit a Pull Request explaining what changed and why

### Improving Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples or tutorials
- Improve the structure or organization
- Translate content to other languages

### Reporting Issues

If you find a problem with an existing skill or documentation:

1. Check if the issue already exists
2. If not, open a new issue with:
   - Clear title and description
   - Steps to reproduce (if applicable)
   - Expected vs actual behavior
   - Screenshots or examples (if helpful)

## Skill Submission Guidelines

### Skill Requirements

To be included in this curation, a skill must:

1. **Be operational on Base**: The skill must work on Base mainnet or Sepolia testnet
2. **Have clear documentation**: Must include a SKILL.md with installation and usage instructions
3. **Be actively maintained**: The underlying project should be actively maintained
4. **Follow security best practices**: Smart contracts should be audited or follow security guidelines
5. **Be agent-compatible**: Must work with OpenClaw or similar agent frameworks

### File Structure

Each skill should follow this structure:

```
skills/{skill-name}/
├── SKILL.md          # Main skill documentation with frontmatter
├── README.md         # (Optional) Additional documentation
└── examples/         # (Optional) Example usage files
```

### Frontmatter Format

Every SKILL.md must include YAML frontmatter at the top:

```yaml
---
name: "Skill Name"
description: "Brief description of what the skill does"
author: "@project_handle"
version: "1.0.0"
source: "https://github.com/your-org/your-repo"
categories: ["defi", "trading"]
chain: "base"
---
```

#### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Display name of the skill |
| `description` | Yes | One-line description (max 160 chars) |
| `author` | Yes | Project handle (e.g., @basezh) |
| `version` | Yes | Semantic version (e.g., 1.0.0) |
| `source` | Yes | URL to source code or documentation |
| `categories` | Yes | Array of category tags |
| `chain` | Yes | Target chain ("base", "base-sepolia", or "base,base-sepolia") |
| `install` | No | Installation command or instructions |
| `env` | No | Required environment variables |

## Development Workflow

1. **Fork the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/agent-skills-on-base.git
   cd agent-skills-on-base
   ```

2. **Create a branch**
   ```bash
   git checkout -b add-skill-{skill-name}
   ```

3. **Make your changes**
   - Add/update skill files
   - Update README.md if needed
   - Test your changes locally

4. **Commit with clear messages**
   ```bash
   git commit -m "Add skill: {skill-name} - brief description"
   ```

5. **Push and create PR**
   ```bash
   git push origin add-skill-{skill-name}
   ```

## Review Process

All submissions go through a review process:

1. **Automated checks**: Basic validation of file structure and frontmatter
2. **Maintainer review**: Core team reviews for quality and relevance
3. **Community feedback**: Open for community comments for 48 hours
4. **Merge or request changes**: Approved PRs are merged, others receive feedback

### Review Criteria

- **Relevance**: Does it fit the Base agent ecosystem?
- **Quality**: Is documentation clear and complete?
- **Accuracy**: Is the information up-to-date and correct?
- **Security**: Does it follow security best practices?
- **Uniqueness**: Does it add new capabilities not already covered?

## Questions?

- Join our [Telegram](https://t.me/basezh)
- Follow us on [X/Twitter](https://x.com/basezh)
- Connect on [Farcaster](https://farcaster.xyz/basezh)

Thank you for helping build the onchain agent ecosystem on Base! 🦾⛓️
