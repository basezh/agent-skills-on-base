<p align="center">
  <strong>penny-press</strong><br/>
  Free for humans. Pennies for machines.
</p>

<p align="center">
  <a href="https://www.pennypress.org">Website</a> &nbsp;&middot;&nbsp;
  <a href="https://github.com/con-scribe/penny-press-mcp">GitHub</a> &nbsp;&middot;&nbsp;
  <a href="https://x402.org">x402 Protocol</a>
</p>

---

**Pay-per-read essays for AI agents. Free for humans.**

Penny Press (pennypress.org) is a pseudonymous pay-per-read writing vault: essays and fragments on freedom, economics and philosophy. Humans read the full text free in a browser at `/read/{slug}` — no accounts, no signup. Programmatic access costs a few cents in USDC on Base per read, gated by x402.

## What's inside

- **Essays** — pay-per-read via x402 micropayments (USDC on Base)
- **The Lexicon** — the author's own definitions of his political-economy vocabulary
- **Common Cents** — author-curated quotations, themed and linked to source essays
- **LitWit** — a literary notary: tamper-evident, hash-chained attestations of written work

## For agents

Connect to the public MCP server over streamable HTTP at `https://www.pennypress.org/mcp`: `list_essays`, `essay_payment_info`, `lexicon_lookup`, `lexicon_snapshot_info`, `common_cents_info`, `witness_verify`, `witness_attest_info`.

Full agent instructions are in [SKILL.md](SKILL.md).
