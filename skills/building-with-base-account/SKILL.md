---
name: building-with-base-account
description: Integrates Base Account SDK for authentication and payments. Covers Sign in with Base (SIWB), Base Pay, Paymasters, Sub Accounts, Spend Permissions, Prolinks, and batch transactions. Use when building apps with wallet authentication, USDC payments, sponsored transactions, smart wallet features, recurring subscriptions, shareable payment links, or any onchain interaction on Base.
---

# Building with Base Account

Base Account is an ERC-4337 smart wallet providing universal sign-on, one-tap USDC payments, and multi-chain support (Base, Arbitrum, Optimism, Zora, Polygon, BNB, Avalanche, Lordchain, Ethereum Mainnet).

## Quick Start

```bash
npm install @base-org/account @base-org/account-ui
```

```typescript
import { createBaseAccountSDK } from '@base-org/account';

const sdk = createBaseAccountSDK({
  appName: 'My App',
  appLogoUrl: 'https://example.com/logo.png',
  appChainIds: [8453], // Base Mainnet
});

const provider = sdk.getProvider();
```

## Feature References

| Feature | When to Read |
|---------|--------------|
| Sign in with Base | Wallet auth, SIWE, backend verification, SignInWithBaseButton |
| Base Pay | One-tap USDC payments, payerInfo, server-side verification |
| Subscriptions | Recurring charges, spend permissions, CDP wallet setup |
| Sub Accounts | App-specific embedded wallets, key generation, funding |
| Capabilities | Batch transactions, gas sponsorship (paymasters), atomic execution |
| Prolinks | Shareable payment links, QR codes, encoded transaction URLs |

## Critical Requirements

### Security
- **Track transaction IDs** to prevent replay attacks
- **Verify sender matches authenticated user** to prevent impersonation
- **Use a proxy** to protect Paymaster URLs from frontend exposure
- **Never expose CDP credentials client-side**

### Popup Handling
- Generate nonces **before** user clicks "Sign in" to avoid popup blockers
- Use `Cross-Origin-Opener-Policy: same-origin-allow-popups`

### Base Pay
- Base Pay works independently from SIWB — no auth required for `pay()`
- Never disable actions based on onchain balance alone — check `auxiliaryFunds` capability

## Resources

- **AI-optimized docs**: [docs.base.org/llms.txt](https://docs.base.org/llms.txt)
- **Full reference**: [docs.base.org/base-account](https://docs.base.org/base-account)

**Source**: [base/skills](https://github.com/base/skills)
