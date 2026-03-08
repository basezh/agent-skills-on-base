---
name: running-a-base-node
description: Runs a Base node for production. Covers hardware requirements, Reth client setup, networking, sync troubleshooting. Use when setting up self-hosted RPC or archive nodes.
---

# Running a Base Node

## Security

- **Restrict RPC access** — bind to 127.0.0.1 or private interface
- **Firewall**: open only 9222 (Discovery v5) and 30303 (P2P)
- **Run as non-root** with minimal permissions
- **Use TLS** if exposing RPC remotely

## Hardware

- **CPU**: 8-Core minimum
- **RAM**: 16 GB minimum
- **Storage**: NVMe SSD, `(2 × chain_size) + snapshot_size + 20% buffer`

## Networking

- **Port 9222**: Reth Discovery v5 (critical)
- **Port 30303**: P2P Discovery & RLPx

## Client

Use **Reth** for Base. Geth Archive Nodes no longer supported.

## Syncing

- Initial sync takes days
- Use snapshots to accelerate
- Incomplete sync: `Error: nonce has already been used` when deploying

**Source**: [base/skills](https://github.com/base/skills)
