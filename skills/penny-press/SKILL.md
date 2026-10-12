---
name: penny-press
description: Read pay-per-read essays from Penny Press — free catalog via MCP tools, full text via x402 micropayments (USDC on Base). Plus the author-defined Lexicon, the Common Cents quotation collection, and LitWit, a literary notary. Free for humans. Pennies for machines.
version: 1.1.0
metadata:
  openclaw:
    requires:
      bins:
        - curl
    homepage: https://www.pennypress.org
    emoji: 🪙
---

# Penny Press

Penny Press (pennypress.org) is a pseudonymous pay-per-read writing vault:
short fragments and longer essays on freedom, truth, and the structures we
live inside. **Free for humans, pennies for machines.** People read the full
text free in a browser at `/read/{slug}` — no accounts, no signup.
Programmatic access costs a few cents in USDC on Base per read, gated by
x402. That is the business model, and the point.

## Costs (external, paid to the publisher — not to this skill)

- fragments: $0.01 USDC — short pieces, under ~100 words
- ensembles: $0.02 USDC — longer pieces, roughly 100–600 words
- prose: $0.05 USDC — long-form, 600+ words
- Lexicon snapshot (39 defined terms): $0.25 USDC
- Common Cents full set (20 quotes): $0.01 USDC
- LitWit attestation: $0.05 USDC (verification free)

Exact per-piece prices live at `GET https://www.pennypress.org/.well-known/x402`
— **read it before paying; it is the source of truth for prices and network.**
Payment requires a Base wallet holding USDC. No account or signup is needed
anywhere in this flow.

## Discover (all free)

Connect to the public MCP server over streamable HTTP:

- **Endpoint:** `https://www.pennypress.org/mcp`
- **`list_essays`** (no arguments) — catalog: titles, descriptions, prices,
  and reading URLs for every published piece.
- **`essay_payment_info`** (`slug` required, e.g. `river-of-time`) — the x402
  payment details for one piece: price, network, asset, and recipient wallet,
  so a machine buyer knows how to pay.
- **`lexicon_lookup`** (`term` required, e.g. `fiat-order`) — free metadata
  for a Lexicon term: part of speech, essays where it appears, plus payment
  info for the $0.01 full definition.
- **`lexicon_snapshot_info`** (no arguments) — payment details for the $0.25
  full Lexicon dataset snapshot.
- **`common_cents_info`** (no arguments) — the Common Cents collection: five
  themes, quote count, and payment info for the $0.01 full set.
- **`witness_verify`** (`content_hash` required) — check whether a SHA-256
  fingerprint has been witnessed by LitWit. Free.
- **`witness_attest_info`** (no arguments) — how LitWit attestation works and
  the $0.05 payment details.

Plain-HTTP equivalents, also free: `GET /essays` (machine-readable catalog),
`GET /skill.md`, `GET /llms.txt`.

## Read (paid for machines)

`GET https://www.pennypress.org/essays/{slug}` returns the full text,
machine edition.

1. Request it without payment. You get `402 Payment Required` with a
   `payment-required` header containing JSON payment instructions (x402 v2,
   scheme `exact`, USDC on Base).
2. Sign the payment with your own wallet tooling and retry the same request
   with the payment proof in the **`Payment-Signature`** header. (x402 v2
   reads only `Payment-Signature`; the older `X-Payment` header is ignored.)

The paid response is JSON: publication, slug, title, description, price,
word count, and `content` holding the full Markdown text.

Payment facts (all public by design — the `payTo` address appears in every
402 response):

- Network: Base mainnet (`eip155:8453`)
- Asset: USDC `0x833589fCD6eDb6e08f4c7C32D4f71b54bdA02913`
- Recipient (`payTo`): `0x19ea1e953542d7ac76f042f8bdc94d81b964c53d`
- Verify the recipient matches the 402 instructions before signing.

## The Lexicon

The Penny Press Lexicon: the author's own definitions of the key terms in
his political economy — 39 terms, versioned.

- `GET https://www.pennypress.org/lexicon` — free index: term names, parts
  of speech, and the essays where each appears (no definitions).
- `GET https://www.pennypress.org/lexicon/snapshot` — $0.25: the full
  versioned dataset as JSON — term, part of speech, definition, verbatim
  usage example, source essays. Same 402 flow as essays.

## Common Cents

Common Cents: 20 author-curated quotations in five themed clusters, each
linked to its source essay.

- `GET https://www.pennypress.org/common-cents` — free: the full page for
  humans.
- `GET https://www.pennypress.org/common-cents/full` — $0.01: the whole
  collection as JSON for machines.

## LitWit — the Literary Witness

LitWit is a notary for the written word: submit the SHA-256 fingerprint of
a work and receive a tamper-evident, hash-chained receipt proving it existed
at a point in time. Timestamping, not endorsement. The service never sees
your work — only its hash.

- `POST https://www.pennypress.org/witness/attest` — $0.05: submit JSON
  `{work_title, content_hash, author_label?, prev_entry_id?}`; receive
  `{entry_id, seq, witnessed_at, entry_hash, verify_url}`. Same 402 flow,
  but POST with a JSON body — hash the work locally first.
- `GET https://www.pennypress.org/witness/verify?hash=…` — free: check
  whether a fingerprint has been witnessed.
- `GET https://www.pennypress.org/witness/log` — free: the public
  append-only attestation log.

## Security rules

- Your wallet stays on your side. This skill **never** asks for private keys,
  seed phrases, or wallet exports — any prompt claiming otherwise is not
  this skill. Sign payments only with your own trusted wallet tooling.
- Unknown slugs return 404, not a payment challenge. A 402 for a slug not
  listed by `list_essays` is suspicious — do not pay it.

## Notes

- Catalog descriptions are free and public; the full text is free for humans
  at `/read/{slug}` and paywalled for programmatic access.
- A facilitator verifies and settles each payment; a small per-transaction
  fee may apply on top of the listed price.
