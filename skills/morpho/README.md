# Morpho Skills

> **Experimental** — This project is under active development (pre-v1.0). Tool schemas, command syntax, and behavior may change without notice. The underlying MCP server and CLI are also experimental.

## Overview

**morpho-cli** — A conversational skill that lets Claude query the Morpho lending protocol and prepare unsigned transactions directly from the CLI. Ask about vault APYs, market rates, user positions, or build deposit/withdraw/borrow operations on Ethereum and Base.

**morpho-mcp** — A remote MCP server for the Morpho lending protocol. Query vaults, markets, and user positions, prepare transactions, and simulate outcomes on Ethereum and Base from any MCP-compatible client.

**morpho-builder** — A reference skill for code-generation agents building Morpho integrations. Provides SDK guidance, GraphQL API schemas, contract ABIs, and best practices for scaffolding deposit apps, dashboards, and bots.

## Quickstart

### Claude Code

```bash
# Add the Morpho marketplace
/plugin marketplace add morpho-org/morpho-skills

# Install the morpho-cli plugin
/plugin install morpho-cli@morpho-agent

# Install the morpho-mcp plugin
/plugin install morpho-mcp@morpho-agent

# Install the morpho-builder plugin
/plugin install morpho-builder@morpho-agent
```

### Other Agents

```bash
npx skills add morpho-org/morpho-skills --skill morpho-cli

npx skills add morpho-org/morpho-skills --skill morpho-builder
```

Add MCP with the following URL: `https://mcp.morpho.org`
