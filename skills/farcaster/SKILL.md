---
name: farcaster
description: Autonomous Farcaster account creation and casting without human intervention.
homepage: https://www.farcaster.xyz
---

# Farcaster Agent

Autonomous Farcaster account creation and casting without human intervention.

**OpenClaw Skill:** This repository includes an OpenClaw-compatible skill in the `skill/` directory. Install it with:
```bash
npx clawhub@latest install farcaster-agent
```
Or copy `skill/` to `~/.openclaw/skills/farcaster-agent/`.

This toolkit allows an AI agent (or script) to:
1. Create a new Farcaster account (register an FID)
2. Add a signer key for posting
3. Post casts to the network

All operations are fully programmatic - no Farcaster app or manual steps required.

**For AI agents:** See [AGENT_GUIDE.md](./AGENT_GUIDE.md) for detailed implementation instructions.

## Prerequisites

- Node.js 18+
- **$1 of ETH or USDC** on any major chain (Ethereum, Optimism, Base, Arbitrum, Polygon)

The toolkit handles bridging and swapping automatically.

## Installation

```bash
npm install
```

## Quick Start (Fully Automatic)

Send $1 of ETH or USDC to your wallet on any supported chain, then:

```bash
PRIVATE_KEY=0x... npm run auto
# or
PRIVATE_KEY=0x... node src/auto-setup.js "Your first cast text"
```

This will:
1. Detect your funds across all chains
2. Bridge/swap to get ETH on Optimism and USDC on Base
3. Register your FID
4. Add a signer key
5. Post your first cast
6. Save credentials to `~/.openclaw/farcaster-credentials.json` or `./credentials.json`

**Security Note:** Credentials are stored as plain text JSON with restricted file permissions. Anyone with access to these files can control both the wallet funds and the Farcaster account. For production use, implement your own secure storage solution.

## Manual Step-by-Step

### 1. Generate a Wallet

```javascript
const { Wallet } = require('ethers');
const wallet = Wallet.createRandom();
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('Mnemonic:', wallet.mnemonic.phrase);
```

### 2. Fund the Wallet

- Send ~0.005 ETH to the address on **Optimism** (for FID registration)
- Send ~0.001 ETH to the same address on **Base** (for USDC swap)

### 3. Register FID

```bash
PRIVATE_KEY=0x... node src/register-fid.js
```

### 4. Add Signer Key

```bash
PRIVATE_KEY=0x... node src/add-signer.js
```

Save the signer private key that's output - you need it to post casts.

### 5. Swap ETH to USDC (for x402 payments)

```bash
PRIVATE_KEY=0x... node src/swap-to-usdc.js
```

### 6. Post a Cast

```bash
PRIVATE_KEY=0x... SIGNER_PRIVATE_KEY=... FID=123 node src/post-cast.js "Hello Farcaster!"
```

### 7. Set Up Profile (Optional)

```bash
# Set username, display name, bio, and profile picture
PRIVATE_KEY=0x... SIGNER_PRIVATE_KEY=... FID=123 npm run profile myusername "Display Name" "My bio" "https://example.com/pfp.png"
```

## Cost Breakdown

| Operation | Network | Cost |
|-----------|---------|------|
| FID Registration | Optimism | ~$0.20 |
| Add Signer | Optimism | ~$0.05 gas |
| ETH→USDC Swap | Base | ~$0.10 gas |
| Each API call | Base (x402) | $0.001 USDC |

Total to get started: ~$0.50-1.00

## Programmatic Usage

```javascript
const { registerFid, addSigner, postCast, swapEthToUsdc } = require('./src');

async function main() {
  const privateKey = '0x...';

  // 1. Register FID
  const { fid } = await registerFid(privateKey);

  // 2. Add signer
  const { signerPrivateKey } = await addSigner(privateKey);

  // 3. Get USDC for x402 (on Base)
  await swapEthToUsdc(privateKey);

  // 4. Post cast
  const { hash } = await postCast({
    privateKey,
    signerPrivateKey,
    fid: Number(fid),
    text: 'Hello from my autonomous agent!'
  });

  console.log('Cast:', hash);
}
```

## License

MIT

Original: https://github.com/rishavmukherji/farcaster-agent
