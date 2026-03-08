---
name: deploying-contracts-on-base
description: Deploys smart contracts to Base using Foundry. Covers forge create, contract verification, testnet faucet via CDP, BaseScan API key. Use when deploying Solidity contracts to Base Mainnet or Sepolia.
---

# Deploying Contracts on Base

## Prerequisites

1. Configure RPC (testnet: `sepolia.base.org`, mainnet: `mainnet.base.org`)
2. Store private keys in Foundry keystore — **never commit keys**
3. [CDP Faucet](https://portal.cdp.coinbase.com/products/faucet) for testnet ETH
4. [BaseScan API key](https://basescan.org/myapikey) for verification

## Security

- **Never commit private keys** — use `cast wallet import`
- **Never hardcode API keys** — use env vars
- **Add `.env` to .gitignore**
- **Verify contracts on BaseScan**

## Deployment Commands

### Testnet
```bash
forge create src/MyContract.sol:MyContract \
  --rpc-url https://sepolia.base.org \
  --account <keystore-account> \
  --verify --etherscan-api-key $ETHERSCAN_API_KEY
```

### Mainnet
```bash
forge create src/MyContract.sol:MyContract \
  --rpc-url https://mainnet.base.org \
  --account <keystore-account> \
  --verify --etherscan-api-key $ETHERSCAN_API_KEY
```

## foundry.toml

```toml
[etherscan]
base-sepolia = { key = "${ETHERSCAN_API_KEY}", url = "https://api-sepolia.basescan.org/api" }
base = { key = "${ETHERSCAN_API_KEY}", url = "https://api.basescan.org/api" }
```

**Source**: [base/skills](https://github.com/base/skills)
