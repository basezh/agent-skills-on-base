---
name: fluid
version: 1.0.1
description: Interact with Fluid Protocol — lending (ERC-4626 fTokens) and vaults (T1/T2/T3/T4). Lending: deposit, withdraw, check positions, query APY rates. Vaults: deposit collateral, borrow, repay, manage leveraged positions. Discover contracts programmatically via on-chain resolvers. No API keys needed.
homepage: https://fluid.io
metadata:
  {
    'protocol': 'fluid',
    'category': 'defi',
    'chains': ['ethereum', 'arbitrum', 'base', 'polygon', 'plasma'],
  }
---

# Fluid Protocol

Fluid is a DeFi protocol by Instadapp offering lending and vault products. All data reads use on-chain resolver contracts — no API dependency, no keys required.

**On-chain first:** Every read operation goes through resolver contracts deployed at the same address on all chains.

## Skill Files

| File                     | URL                                                                                                                  | Status  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------- |
| **SKILL.md** (this file) | `https://fluid.io/skill.md`                                                                                          | ✅ Live |
| **Deployments**          | [deployments.md on GitHub](https://github.com/Instadapp/fluid-contracts-public/blob/main/deployments/deployments.md) | ✅ Live |
| **Integration Docs**     | `https://fluid-integration-docs.vercel.app/`                                                                         | ✅ Live |

---

# Fluid: Lending Protocol

---

## How fTokens Work (ERC-4626)

Fluid lending tokens (fUSDC, fWETH, etc.) follow the **ERC-4626 tokenized vault standard**. This is important to understand:

**Shares are NOT 1:1 with underlying tokens.** When you deposit USDC, you receive fUSDC *shares*. The exchange rate between shares and assets increases over time as interest accrues.

```
Day 0:  deposit 1000 USDC → receive 1000 fUSDC shares  (rate: 1.000)
Day 90: your 1000 fUSDC shares → now worth 1010 USDC     (rate: 1.010)
```

| Concept | Description |
| --- | --- |
| **Assets** | The underlying token (USDC, WETH, etc.) |
| **Shares** | The fToken balance you hold (fUSDC, fWETH, etc.) |
| **Exchange Rate** | Increases over time. `convertToAssets(shares)` gives current value. |
| `deposit(assets, receiver)` | Deposit underlying → receive shares. Amount is in *assets* (e.g., USDC). |
| `withdraw(assets, receiver, owner)` | Specify underlying amount to withdraw. Burns the required shares. |
| `redeem(shares, receiver, owner)` | Specify shares to burn. Receive the equivalent underlying. |
| `mint(shares, receiver)` | Specify exact shares you want. Deposit the required assets. |

> **Common mistake:** Don't assume `shares == assets`. Always use `convertToAssets()` or `convertToShares()` to convert between them. The exchange rate at genesis is approximately 1:1 but diverges over time.

```javascript
// Check how much your shares are worth
const shares = await fUsdc.read.balanceOf([userAddress]);
const currentValue = await fUsdc.read.convertToAssets([shares]);
console.log(`${shares} fUSDC shares = ${formatUnits(currentValue, 6)} USDC`);
```

---

## Quick Start

No registration or API keys needed. Just call the on-chain resolver.

### Step 1: Pick your chain and RPC

| Network  | Chain ID | LendingResolver Address                      | Public RPC                     |
| -------- | -------- | -------------------------------------------- | ------------------------------ |
| Ethereum | 1        | `0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569` | `https://eth.llamarpc.com`     |
| Arbitrum | 42161    | `0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569` | `https://arb1.arbitrum.io/rpc` |
| Base     | 8453     | `0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569` | `https://mainnet.base.org`     |
| Polygon  | 137      | `0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569` | `https://polygon-rpc.com`      |
| Plasma   | 9745     | `0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569` | `https://rpc.plasma.to`        |

> Same resolver address on all chains (CREATE2 deployment). Any RPC provider works (Alchemy, Infura, QuickNode, etc.).

### Step 2: Query fToken data

```bash
# Get all fToken addresses on the chain
cast call 0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569 \
  "getAllFTokens()(address[])" \
  --rpc-url https://eth.llamarpc.com

# Get complete data for all fTokens (APY, TVL, rates)
cast call 0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569 \
  "getFTokensEntireData()" \
  --rpc-url https://eth.llamarpc.com
```

### Step 3: Check a user position

```bash
# Get user position for fUSDC
cast call 0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569 \
  "getUserPosition(address,address)" \
  0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33 \
  0xYOUR_ADDRESS \
  --rpc-url https://eth.llamarpc.com

# Get all user positions across every fToken
cast call 0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569 \
  "getUserPositions(address)" \
  0xYOUR_ADDRESS \
  --rpc-url https://eth.llamarpc.com
```

### Step 4: Deposit or withdraw

```bash
# Deposit 1000 USDC into fUSDC (requires prior ERC-20 approval)
cast send 0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33 \
  "deposit(uint256,address)" \
  1000000000 0xYOUR_ADDRESS \
  --rpc-url https://eth.llamarpc.com \
  --private-key $PRIVATE_KEY

# Withdraw 500 USDC from fUSDC
cast send 0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33 \
  "withdraw(uint256,address,address)" \
  500000000 0xYOUR_ADDRESS 0xYOUR_ADDRESS \
  --rpc-url https://eth.llamarpc.com \
  --private-key $PRIVATE_KEY

# Deposit native ETH into fWETH (payable)
cast send 0x90551c1795392094FE6D29B758EcCD233cFAa260 \
  "depositNative(address)" \
  0xYOUR_ADDRESS \
  --value 1ether \
  --rpc-url https://eth.llamarpc.com \
  --private-key $PRIVATE_KEY
```

---

## Everything You Can Do

| Action                               | Method                                                | Contract         |
| ------------------------------------ | ----------------------------------------------------- | ---------------- |
| Get all fToken addresses             | `getAllFTokens()`                                     | LendingResolver  |
| Get all fToken data (APY, TVL)       | `getFTokensEntireData()`                              | LendingResolver  |
| Get single fToken details            | `getFTokenDetails(fToken)`                            | LendingResolver  |
| Get user position (one fToken)       | `getUserPosition(fToken, user)`                       | LendingResolver  |
| Get user positions (all fTokens)     | `getUserPositions(user)`                              | LendingResolver  |
| Preview deposit/mint/withdraw/redeem | `getPreviews(fToken, assets, shares)`                 | LendingResolver  |
| Deposit ERC-20 assets                | `deposit(assets, receiver)`                           | fToken           |
| Mint exact shares                    | `mint(shares, receiver)`                              | fToken           |
| Withdraw assets                      | `withdraw(assets, receiver, owner)`                   | fToken           |
| Redeem shares                        | `redeem(shares, receiver, owner)`                     | fToken           |
| Deposit native ETH                   | `depositNative(receiver)`                             | fToken (payable) |
| Withdraw native ETH                  | `withdrawNative(assets, receiver, owner)`             | fToken           |
| Check max deposit/withdraw           | `maxDeposit(receiver)` / `maxWithdraw(owner)`         | fToken           |
| Check exchange rate                  | `convertToAssets(shares)` / `convertToShares(assets)` | fToken           |

---

## Contract Addresses (All Verified)

> All contracts are verified on their respective block explorers. Click any link to read the source code directly.

### LendingResolver (read positions, APY, TVL)

Address: `0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569` — same on all chains (CREATE2). **Verified.**

| Network  | Explorer (verified source)                                                                     |
| -------- | ---------------------------------------------------------------------------------------------- |
| Ethereum | [Etherscan](https://etherscan.io/address/0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569#code)      |
| Arbitrum | [Arbiscan](https://arbiscan.io/address/0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569#code)        |
| Base     | [Basescan](https://basescan.org/address/0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569#code)       |
| Polygon  | [Polygonscan](https://polygonscan.com/address/0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569#code) |
| Plasma   | [Plasmascan](https://plasmascan.to/address/0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569#code)    |

### LendingFactory

Address: `0x54B91A0D94cb471F37f949c60F7Fa7935b551D03` — same on all chains (CREATE2). **Verified.**

| Network  | Explorer (verified source)                                                                     |
| -------- | ---------------------------------------------------------------------------------------------- |
| Ethereum | [Etherscan](https://etherscan.io/address/0x54B91A0D94cb471F37f949c60F7Fa7935b551D03#code)      |
| Arbitrum | [Arbiscan](https://arbiscan.io/address/0x54B91A0D94cb471F37f949c60F7Fa7935b551D03#code)        |
| Base     | [Basescan](https://basescan.org/address/0x54B91A0D94cb471F37f949c60F7Fa7935b551D03#code)       |
| Polygon  | [Polygonscan](https://polygonscan.com/address/0x54B91A0D94cb471F37f949c60F7Fa7935b551D03#code) |
| Plasma   | [Plasmascan](https://plasmascan.to/address/0x54B91A0D94cb471F37f949c60F7Fa7935b551D03#code)    |

**Source:** [deployments.md](https://github.com/Instadapp/fluid-contracts-public/blob/main/deployments/deployments.md)

### fTokens (Ethereum Mainnet)

| Token   | fToken Address                               | Underlying    |
| ------- | -------------------------------------------- | ------------- |
| fUSDC   | `0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33` | USDC          |
| fUSDT   | `0x5C20B550819128074FD538Edf79791733ccEdd18` | USDT          |
| fWETH   | `0x90551c1795392094FE6D29B758EcCD233cFAa260` | WETH (native) |
| fGHO    | Check resolver                               | GHO           |
| fwstETH | Check resolver                               | wstETH        |

> Use `getAllFTokens()` on LendingResolver to get the complete, up-to-date list for any network.

---

## Understanding Rates

The resolver returns rates in **basis points** (1 bp = 0.01%, so `10000` = 100%):

- `supplyRate` — interest from borrowers at the Liquidity Layer (e.g., `390` = 3.90%)
- `rewardsRate` — additional native rewards, if active (e.g., `149` = 1.49%)
- **Total APR** = `supplyRate` + `rewardsRate`

```javascript
const supplyApr = Number(result.supplyRate) / 100; // 390 → 3.90%
const rewardsApr = Number(result.rewardsRate) / 100; // 149 → 1.49%
const totalApr = supplyApr + rewardsApr; // 5.39%
```

---

## Code Examples (viem/Node.js)

### Deposit USDC

```javascript
const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const fUsdcAddress = '0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33';
const amount = 1000n * 10n ** 6n; // 1000 USDC

// 1. Approve fUSDC to spend USDC
await usdc.write.approve([fUsdcAddress, amount]);

// 2. Deposit USDC → receive fUSDC shares
const shares = await fUsdc.write.deposit([amount, userAddress]);
```

### Deposit Native ETH

```javascript
const fWethAddress = '0x90551c1795392094FE6D29B758EcCD233cFAa260';
const amount = parseEther('1'); // 1 ETH

// Deposit ETH directly (payable)
const shares = await fWeth.write.depositNative([userAddress], { value: amount });
```

### Withdraw Assets

```javascript
// Withdraw specific amount of underlying
const assetsToWithdraw = 500n * 10n ** 6n; // 500 USDC
await fUsdc.write.withdraw([assetsToWithdraw, userAddress, userAddress]);

// OR redeem all fToken shares
const shares = await fUsdc.read.balanceOf([userAddress]);
const maxRedeemable = await fUsdc.read.maxRedeem([userAddress]);
await fUsdc.write.redeem([Math.min(shares, maxRedeemable), userAddress, userAddress]);
```

### Full Example: Check APY + User Position

```javascript
import { createPublicClient, http, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';

const LENDING_RESOLVER = '0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569';
const F_USDC = '0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33';

const resolverAbi = [
  {
    name: 'getFTokenDetails',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'fToken_', type: 'address' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'tokenAddress', type: 'address' },
          { name: 'eip2612Deposits', type: 'bool' },
          { name: 'isNativeUnderlying', type: 'bool' },
          { name: 'name', type: 'string' },
          { name: 'symbol', type: 'string' },
          { name: 'decimals', type: 'uint256' },
          { name: 'asset', type: 'address' },
          { name: 'totalAssets', type: 'uint256' },
          { name: 'totalSupply', type: 'uint256' },
          { name: 'convertToShares', type: 'uint256' },
          { name: 'convertToAssets', type: 'uint256' },
          { name: 'rewardsRate', type: 'uint256' },
          { name: 'supplyRate', type: 'uint256' },
          { name: 'rebalanceDifference', type: 'int256' },
          { name: 'liquidityUserSupplyData', type: 'tuple', components: [] },
        ],
      },
    ],
  },
  {
    name: 'getUserPosition',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'fToken_', type: 'address' },
      { name: 'user_', type: 'address' },
    ],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'fTokenShares', type: 'uint256' },
          { name: 'underlyingAssets', type: 'uint256' },
          { name: 'underlyingBalance', type: 'uint256' },
          { name: 'allowance', type: 'uint256' },
        ],
      },
    ],
  },
];

async function main() {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(process.env.ETH_RPC_URL),
  });

  // 1. Get fUSDC details
  const details = await client.readContract({
    address: LENDING_RESOLVER,
    abi: resolverAbi,
    functionName: 'getFTokenDetails',
    args: [F_USDC],
  });

  const supplyApr = Number(details.supplyRate) / 100;
  const rewardsApr = Number(details.rewardsRate) / 100;
  const tvl = formatUnits(details.totalAssets, 6);

  console.log(
    `fUSDC — Supply APR: ${supplyApr.toFixed(2)}%, Rewards: ${rewardsApr.toFixed(2)}%, TVL: ${Number(tvl).toLocaleString()} USDC`,
  );

  // 2. Check user position
  const userAddress = '0xYourAddress';
  const position = await client.readContract({
    address: LENDING_RESOLVER,
    abi: resolverAbi,
    functionName: 'getUserPosition',
    args: [F_USDC, userAddress],
  });

  console.log(
    `Position — Shares: ${formatUnits(position.fTokenShares, 6)}, Underlying: ${formatUnits(position.underlyingAssets, 6)} USDC`,
  );
}

main().catch(console.error);
```

---

## Common Patterns

### Check if deposit will succeed

```javascript
const minDeposit = await fToken.minDeposit();
const maxDeposit = await fToken.maxDeposit(receiver);

if (amount < minDeposit) throw new Error('Amount below minimum');
if (amount > maxDeposit) throw new Error('Amount exceeds maximum');

const expectedShares = await fToken.previewDeposit(amount);
```

### Withdraw max

```javascript
const maxWithdrawable = await fToken.maxWithdraw(userAddress);
await fToken.withdraw(maxWithdrawable, userAddress, userAddress);
```

### Monitor yield earned (using blockTag)

Compare exchange rates at deposit time vs now to calculate exact yield:

```javascript
const depositBlockNumber = 19500000n; // from tx receipt
const userShares = await fToken.read.balanceOf([userAddress]);

// Value at deposit time
const valueAtDeposit = await client.readContract({
  address: F_USDC,
  abi: fTokenAbi,
  functionName: 'convertToAssets',
  args: [userShares],
  blockNumber: depositBlockNumber,
});

// Value now
const valueNow = await client.readContract({
  address: F_USDC,
  abi: fTokenAbi,
  functionName: 'convertToAssets',
  args: [userShares],
  blockTag: 'latest',
});

const earned = valueNow - valueAtDeposit;
console.log(`Yield earned: ${formatUnits(earned, 6)} USDC`);
```

**With cast (CLI):**

```bash
# Value at deposit block
cast call 0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33 \
  "convertToAssets(uint256)(uint256)" $USER_SHARES \
  --rpc-url $ETH_RPC_URL --block 19500000

# Value now
cast call 0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33 \
  "convertToAssets(uint256)(uint256)" $USER_SHARES \
  --rpc-url $ETH_RPC_URL
```

> **Tip:** Store the deposit block number from `receipt.blockNumber` for later yield calculations.

### Permit2 Deposits

For tokens that don't support EIP-2612, use Permit2 for gasless approvals:

```javascript
const details = await resolver.getFTokenDetails(fToken);
if (details.eip2612Deposits) {
  // Use standard EIP-2612 permit
} else {
  // Use Permit2 signature
  await fToken.depositWithSignature(assets, receiver, minAmountOut, permit, signature);
}
```

---

## Key Concepts

### fToken Exchange Rate

fTokens appreciate over time as interest accrues. The exchange rate between shares and underlying assets increases continuously. Use `convertToAssets(shares)` and `convertToShares(assets)` to convert between them.

### Withdrawal Limits

Fluid has withdrawal limits that expand over time to protect against bank runs. Always check `maxWithdraw(owner)` before withdrawing large amounts. The `liquidityUserSupplyData` in FTokenDetails exposes the limit parameters: `withdrawalLimit`, `expandPercent`, `expandDuration`, and `baseWithdrawalLimit`.

---

## ABIs

### LendingResolver ABI

```json
[
  {
    "name": "getAllFTokens",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "address[]" }]
  },
  {
    "name": "getFTokensEntireData",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [
      {
        "type": "tuple[]",
        "components": [
          { "name": "tokenAddress", "type": "address" },
          { "name": "eip2612Deposits", "type": "bool" },
          { "name": "isNativeUnderlying", "type": "bool" },
          { "name": "name", "type": "string" },
          { "name": "symbol", "type": "string" },
          { "name": "decimals", "type": "uint256" },
          { "name": "asset", "type": "address" },
          { "name": "totalAssets", "type": "uint256" },
          { "name": "totalSupply", "type": "uint256" },
          { "name": "convertToShares", "type": "uint256" },
          { "name": "convertToAssets", "type": "uint256" },
          { "name": "rewardsRate", "type": "uint256" },
          { "name": "supplyRate", "type": "uint256" },
          { "name": "rebalanceDifference", "type": "int256" },
          {
            "name": "liquidityUserSupplyData",
            "type": "tuple",
            "components": [
              { "name": "isAllowed", "type": "bool" },
              { "name": "supply", "type": "uint256" },
              { "name": "withdrawalLimit", "type": "uint256" },
              { "name": "lastUpdateTimestamp", "type": "uint256" },
              { "name": "expandPercent", "type": "uint256" },
              { "name": "expandDuration", "type": "uint256" },
              { "name": "baseWithdrawalLimit", "type": "uint256" }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "getFTokenDetails",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "fToken_", "type": "address" }],
    "outputs": [
      {
        "type": "tuple",
        "components": [
          { "name": "tokenAddress", "type": "address" },
          { "name": "eip2612Deposits", "type": "bool" },
          { "name": "isNativeUnderlying", "type": "bool" },
          { "name": "name", "type": "string" },
          { "name": "symbol", "type": "string" },
          { "name": "decimals", "type": "uint256" },
          { "name": "asset", "type": "address" },
          { "name": "totalAssets", "type": "uint256" },
          { "name": "totalSupply", "type": "uint256" },
          { "name": "convertToShares", "type": "uint256" },
          { "name": "convertToAssets", "type": "uint256" },
          { "name": "rewardsRate", "type": "uint256" },
          { "name": "supplyRate", "type": "uint256" },
          { "name": "rebalanceDifference", "type": "int256" },
          {
            "name": "liquidityUserSupplyData",
            "type": "tuple",
            "components": [
              { "name": "isAllowed", "type": "bool" },
              { "name": "supply", "type": "uint256" },
              { "name": "withdrawalLimit", "type": "uint256" },
              { "name": "lastUpdateTimestamp", "type": "uint256" },
              { "name": "expandPercent", "type": "uint256" },
              { "name": "expandDuration", "type": "uint256" },
              { "name": "baseWithdrawalLimit", "type": "uint256" }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "getUserPosition",
    "type": "function",
    "stateMutability": "view",
    "inputs": [
      { "name": "fToken_", "type": "address" },
      { "name": "user_", "type": "address" }
    ],
    "outputs": [
      {
        "type": "tuple",
        "components": [
          { "name": "fTokenShares", "type": "uint256" },
          { "name": "underlyingAssets", "type": "uint256" },
          { "name": "underlyingBalance", "type": "uint256" },
          { "name": "allowance", "type": "uint256" }
        ]
      }
    ]
  },
  {
    "name": "getUserPositions",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "user_", "type": "address" }],
    "outputs": [
      {
        "type": "tuple[]",
        "components": [
          {
            "name": "fTokenDetails",
            "type": "tuple",
            "components": [
              { "name": "tokenAddress", "type": "address" },
              { "name": "eip2612Deposits", "type": "bool" },
              { "name": "isNativeUnderlying", "type": "bool" },
              { "name": "name", "type": "string" },
              { "name": "symbol", "type": "string" },
              { "name": "decimals", "type": "uint256" },
              { "name": "asset", "type": "address" },
              { "name": "totalAssets", "type": "uint256" },
              { "name": "totalSupply", "type": "uint256" },
              { "name": "convertToShares", "type": "uint256" },
              { "name": "convertToAssets", "type": "uint256" },
              { "name": "rewardsRate", "type": "uint256" },
              { "name": "supplyRate", "type": "uint256" },
              { "name": "rebalanceDifference", "type": "int256" },
              {
                "name": "liquidityUserSupplyData",
                "type": "tuple",
                "components": [
                  { "name": "isAllowed", "type": "bool" },
                  { "name": "supply", "type": "uint256" },
                  { "name": "withdrawalLimit", "type": "uint256" },
                  { "name": "lastUpdateTimestamp", "type": "uint256" },
                  { "name": "expandPercent", "type": "uint256" },
                  { "name": "expandDuration", "type": "uint256" },
                  { "name": "baseWithdrawalLimit", "type": "uint256" }
                ]
              }
            ]
          },
          {
            "name": "userPosition",
            "type": "tuple",
            "components": [
              { "name": "fTokenShares", "type": "uint256" },
              { "name": "underlyingAssets", "type": "uint256" },
              { "name": "underlyingBalance", "type": "uint256" },
              { "name": "allowance", "type": "uint256" }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "getPreviews",
    "type": "function",
    "stateMutability": "view",
    "inputs": [
      { "name": "fToken_", "type": "address" },
      { "name": "assets_", "type": "uint256" },
      { "name": "shares_", "type": "uint256" }
    ],
    "outputs": [
      { "name": "previewDeposit_", "type": "uint256" },
      { "name": "previewMint_", "type": "uint256" },
      { "name": "previewWithdraw_", "type": "uint256" },
      { "name": "previewRedeem_", "type": "uint256" }
    ]
  }
]
```

### fToken ABI (ERC4626)

```json
[
  {
    "name": "deposit",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "assets", "type": "uint256" },
      { "name": "receiver", "type": "address" }
    ],
    "outputs": [{ "name": "shares", "type": "uint256" }]
  },
  {
    "name": "mint",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "shares", "type": "uint256" },
      { "name": "receiver", "type": "address" }
    ],
    "outputs": [{ "name": "assets", "type": "uint256" }]
  },
  {
    "name": "withdraw",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "assets", "type": "uint256" },
      { "name": "receiver", "type": "address" },
      { "name": "owner", "type": "address" }
    ],
    "outputs": [{ "name": "shares", "type": "uint256" }]
  },
  {
    "name": "redeem",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "shares", "type": "uint256" },
      { "name": "receiver", "type": "address" },
      { "name": "owner", "type": "address" }
    ],
    "outputs": [{ "name": "assets", "type": "uint256" }]
  },
  {
    "name": "asset",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "address" }]
  },
  {
    "name": "totalAssets",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "convertToShares",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "assets", "type": "uint256" }],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "convertToAssets",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "shares", "type": "uint256" }],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "maxDeposit",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "receiver", "type": "address" }],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "maxWithdraw",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "owner", "type": "address" }],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "previewDeposit",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "assets", "type": "uint256" }],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "previewWithdraw",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "assets", "type": "uint256" }],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "minDeposit",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "uint256" }]
  }
]
```

### fToken Native (fWETH) ABI

```json
[
  {
    "name": "depositNative",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [{ "name": "receiver_", "type": "address" }],
    "outputs": [{ "name": "shares_", "type": "uint256" }]
  },
  {
    "name": "depositNative",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "receiver_", "type": "address" },
      { "name": "minAmountOut_", "type": "uint256" }
    ],
    "outputs": [{ "name": "shares_", "type": "uint256" }]
  },
  {
    "name": "withdrawNative",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "assets_", "type": "uint256" },
      { "name": "receiver_", "type": "address" },
      { "name": "owner_", "type": "address" }
    ],
    "outputs": [{ "name": "shares_", "type": "uint256" }]
  },
  {
    "name": "redeemNative",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "shares_", "type": "uint256" },
      { "name": "receiver_", "type": "address" },
      { "name": "owner_", "type": "address" }
    ],
    "outputs": [{ "name": "assets_", "type": "uint256" }]
  }
]
```

____

# Fluid: Vault Protocol

Fluid Vaults enable leveraged borrowing positions — deposit collateral, borrow assets, and manage positions with automated risk management. All positions are represented as NFTs (ERC-721). All data reads use on-chain resolver contracts — no API dependency, no keys required.

**On-chain first:** Every read operation goes through resolver contracts deployed at the same address on all chains.

---

## Borrow Flow (Step by Step)

Borrowing on Fluid always follows this pattern: **deposit collateral → borrow assets**. Both happen in a single `operate()` call.

```
┌─────────────────────────────────────────────────────────────┐
│  1. Pick a vault (e.g., ETH/USDC = deposit ETH, borrow USDC) │
│  2. Approve collateral token (skip for native ETH)            │
│  3. Call operate() with:                                      │
│     - nftId = 0 (create new position)                         │
│     - newCol = positive (deposit collateral)                  │
│     - newDebt = positive (borrow amount)                      │
│     - to = your address (receive borrowed tokens)             │
│  4. You get back: NFT ID + borrowed tokens                    │
└─────────────────────────────────────────────────────────────┘
```

**Minimum viable borrow (T1 vault, cast CLI):**

```bash
# Deposit 1 ETH as collateral, borrow 2000 USDC, in a single transaction
cast send 0x348aD11DB2c90e7FdF8e57420C569F76dBe38a59 \
  "operate(uint256,int256,int256,address)" \
  0 1000000000000000000 2000000000 0xYOUR_ADDRESS \
  --value 1ether \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY
```

**Repay + withdraw (close position):**

```bash
# Step 1: Approve debt token to vault (USDC in this case)
cast send 0xUSDC_ADDRESS "approve(address,uint256)" \
  0x348aD11DB2c90e7FdF8e57420C569F76dBe38a59 \
  2000000000 \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY

# Step 2: Repay all debt + withdraw all collateral
# newDebt = type(int256).min means repay everything
# newCol = type(int256).min means withdraw everything
cast send 0x348aD11DB2c90e7FdF8e57420C569F76dBe38a59 \
  "operate(uint256,int256,int256,address)" \
  YOUR_NFT_ID \
  -57896044618658097711785492504343953926634992332820282019728792003956564819968 \
  -57896044618658097711785492504343953926634992332820282019728792003956564819968 \
  0xYOUR_ADDRESS \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY
```

> **Key insight:** `operate()` is the only function you need. One call can deposit + borrow, or repay + withdraw, or just adjust one side. The sign of `newCol` and `newDebt` determines the direction (positive = deposit/borrow, negative = withdraw/repay).

---

## Vault Types

Fluid supports **4 vault types** based on collateral and debt composition:

| Type | Name | Collateral | Debt | Description |
| ---- | ----- | --------------------- | --------------------- | ----------------------------------------------------------------------- |
| T1 | Basic | Normal (single token) | Normal (single token) | Most gas-efficient. Standard token collateral, standard token debt. |
| T2 | Smart Col | Smart (DEX LP shares) | Normal (single token) | Collateral is a Fluid DEX LP position (two tokens), debt is standard. |
| T3 | Smart Debt | Normal (single token) | Smart (DEX LP shares) | Collateral is standard, debt is a Fluid DEX LP position (two tokens). |
| T4 | Smart Both | Smart (DEX LP shares) | Smart (DEX LP shares) | Both collateral and debt are Fluid DEX LP positions (most flexible). |

> **Smart Collateral / Smart Debt** means the asset is a Fluid DEX liquidity provider position, exposing the user to two underlying tokens instead of one. This enables capital-efficient strategies like looping correlated pairs.

---

## Discovering Vaults Programmatically

Use the **VaultResolver** (`0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC`, same on all chains) to find vaults on any chain without hardcoding addresses.

```javascript
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const VAULT_RESOLVER = '0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC';

const resolverAbi = [
  {
    name: 'getAllVaultsAddresses',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address[]' }],
  },
  {
    name: 'getVaultType',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'vault_', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'getVaultEntireData',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'vault_', type: 'address' }],
    outputs: [{ type: 'tuple', components: [
      { name: 'vault', type: 'address' },
      { name: 'isSmartCol', type: 'bool' },
      { name: 'isSmartDebt', type: 'bool' },
      { name: 'constantVariables', type: 'tuple', components: [
        { name: 'liquidity', type: 'address' },
        { name: 'factory', type: 'address' },
        { name: 'operateImplementation', type: 'address' },
        { name: 'adminImplementation', type: 'address' },
        { name: 'secondaryImplementation', type: 'address' },
        { name: 'deployer', type: 'address' },
        { name: 'supply', type: 'address' },
        { name: 'borrow', type: 'address' },
        { name: 'supplyToken', type: 'tuple', components: [
          { name: 'token0', type: 'address' },
          { name: 'token1', type: 'address' },
        ]},
        { name: 'borrowToken', type: 'tuple', components: [
          { name: 'token0', type: 'address' },
          { name: 'token1', type: 'address' },
        ]},
      ]},
      { name: 'configs', type: 'tuple', components: [
        { name: 'supplyRateMagnifier', type: 'uint256' },
        { name: 'borrowRateMagnifier', type: 'uint256' },
        { name: 'collateralFactor', type: 'uint256' },
        { name: 'liquidationThreshold', type: 'uint256' },
        { name: 'liquidationMaxLimit', type: 'uint256' },
        { name: 'withdrawalGap', type: 'uint256' },
        { name: 'liquidationPenalty', type: 'uint256' },
        { name: 'borrowFee', type: 'uint256' },
        { name: 'oracle', type: 'address' },
        { name: 'oraclePriceOperate', type: 'uint256' },
        { name: 'oraclePriceLiquidate', type: 'uint256' },
        { name: 'rebalancer', type: 'address' },
      ]},
    ]}],
  },
];

async function discoverVaults() {
  const client = createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org'),
  });

  // 1. Get all vault addresses on Base
  const vaults = await client.readContract({
    address: VAULT_RESOLVER,
    abi: resolverAbi,
    functionName: 'getAllVaultsAddresses',
  });
  console.log(`Found ${vaults.length} vaults on Base`);

  // 2. For each vault, get type and key data
  for (const vault of vaults) {
    const vaultType = await client.readContract({
      address: VAULT_RESOLVER,
      abi: resolverAbi,
      functionName: 'getVaultType',
      args: [vault],
    });

    const typeLabel = { 10000n: 'T1', 20000n: 'T2', 30000n: 'T3', 40000n: 'T4' }[vaultType] || `Unknown(${vaultType})`;

    const data = await client.readContract({
      address: VAULT_RESOLVER,
      abi: resolverAbi,
      functionName: 'getVaultEntireData',
      args: [vault],
    });

    const maxLtv = Number(data.configs.collateralFactor) / 100;
    const borrowRate = Number(data.configs.borrowRateMagnifier) / 100;

    console.log(`${vault} | ${typeLabel} | Max LTV: ${maxLtv}% | Smart Col: ${data.isSmartCol} | Smart Debt: ${data.isSmartDebt}`);
  }
}

discoverVaults().catch(console.error);
```

**With cast (CLI):**

```bash
# List all vaults on Base
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "getAllVaultsAddresses()(address[])" \
  --rpc-url https://mainnet.base.org

# Check vault type (10000=T1, 20000=T2, 30000=T3, 40000=T4)
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "getVaultType(address)(uint256)" \
  0xVAULT_ADDRESS \
  --rpc-url https://mainnet.base.org

# Get full vault data (collateral tokens, debt tokens, rates, limits)
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "getVaultEntireData(address)" \
  0xVAULT_ADDRESS \
  --rpc-url https://mainnet.base.org
```

> **No hardcoded vault addresses needed.** The resolver always returns the current, up-to-date list of all active vaults on any chain. Use `getVaultEntireData()` to inspect collateral/debt tokens, rates, and limits before interacting.

---

## Quick Start

No registration or API keys needed. Just call the on-chain resolver.

### Step 1: Pick your chain and RPC

| Network  | Chain ID | VaultResolver Address                        | Public RPC                     |
| -------- | -------- | -------------------------------------------- | ------------------------------ |
| Ethereum | 1        | `0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC` | `https://eth.llamarpc.com`     |
| Arbitrum | 42161    | `0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC` | `https://arb1.arbitrum.io/rpc` |
| Base     | 8453     | `0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC` | `https://mainnet.base.org`     |
| Polygon  | 137      | `0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC` | `https://polygon-rpc.com`      |
| Plasma   | 9745     | `0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC` | `https://rpc.plasma.to`        |

> Same resolver address on all chains (CREATE2 deployment). Any RPC provider works (Alchemy, Infura, QuickNode, etc.).

### Step 2: Query vault data

```bash
# Get all vault addresses on the chain
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "getAllVaultsAddresses()(address[])" \
  --rpc-url https://eth.llamarpc.com

# Get total number of vaults
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "getTotalVaults()(uint256)" \
  --rpc-url https://eth.llamarpc.com

# Get complete data for a specific vault (T1: ETH/GHO)
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "getVaultEntireData(address)" \
  0xD9A7Dcdc57C6e44f00740dC73664fA456B983669 \
  --rpc-url https://eth.llamarpc.com

# Get vault type (10000=T1, 20000=T2, 30000=T3, 40000=T4)
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "getVaultType(address)(uint256)" \
  0xD9A7Dcdc57C6e44f00740dC73664fA456B983669 \
  --rpc-url https://eth.llamarpc.com
```

### Step 3: Check a user position

```bash
# Get all NFT position IDs owned by a user
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "positionsNftIdOfUser(address)(uint256[])" \
  0xYOUR_ADDRESS \
  --rpc-url https://eth.llamarpc.com

# Get position data + vault data by NFT ID
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "positionByNftId(uint256)" \
  42 \
  --rpc-url https://eth.llamarpc.com

# Get all positions + vault data for a user
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "positionsByUser(address)" \
  0xYOUR_ADDRESS \
  --rpc-url https://eth.llamarpc.com

# Find which vault a position NFT belongs to
cast call 0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC \
  "vaultByNftId(uint256)(address)" \
  42 \
  --rpc-url https://eth.llamarpc.com
```

### Step 4: Open a position (T1 Vault — deposit collateral & borrow)

```bash
# Open a new T1 vault position: deposit 1 ETH as collateral, borrow 2000 GHO
# nftId=0 means create new position
# newCol > 0 means deposit collateral
# newDebt > 0 means borrow
cast send 0xD9A7Dcdc57C6e44f00740dC73664fA456B983669 \
  "operate(uint256,int256,int256,address)" \
  0 \
  1000000000000000000 \
  2000000000000000000000 \
  0xYOUR_ADDRESS \
  --value 1ether \
  --rpc-url https://eth.llamarpc.com \
  --private-key $PRIVATE_KEY
```

### Step 5: Manage an existing position

```bash
# Add more collateral to an existing position (nftId=42)
cast send 0xD9A7Dcdc57C6e44f00740dC73664fA456B983669 \
  "operate(uint256,int256,int256,address)" \
  42 \
  500000000000000000 \
  0 \
  0xYOUR_ADDRESS \
  --value 0.5ether \
  --rpc-url https://eth.llamarpc.com \
  --private-key $PRIVATE_KEY

# Repay debt (negative newDebt = payback)
# Requires prior ERC-20 approval of the debt token to the vault
cast send 0xD9A7Dcdc57C6e44f00740dC73664fA456B983669 \
  "operate(uint256,int256,int256,address)" \
  42 \
  0 \
  -1000000000000000000000 \
  0xYOUR_ADDRESS \
  --rpc-url https://eth.llamarpc.com \
  --private-key $PRIVATE_KEY

# Withdraw collateral (negative newCol = withdraw)
cast send 0xD9A7Dcdc57C6e44f00740dC73664fA456B983669 \
  "operate(uint256,int256,int256,address)" \
  42 \
  -250000000000000000 \
  0 \
  0xYOUR_ADDRESS \
  --rpc-url https://eth.llamarpc.com \
  --private-key $PRIVATE_KEY
```

---

## Everything You Can Do

### VaultResolver (read data)

| Action                              | Method                                          | Contract              |
| ----------------------------------- | ----------------------------------------------- | --------------------- |
| Get all vault addresses             | `getAllVaultsAddresses()`                        | VaultResolver         |
| Get total number of vaults          | `getTotalVaults()`                              | VaultResolver         |
| Get vault type                      | `getVaultType(vault)`                           | VaultResolver         |
| Get complete vault data             | `getVaultEntireData(vault)`                     | VaultResolver         |
| Get data for multiple vaults        | `getVaultsEntireData(vaults[])` / `getVaultsEntireData()` | VaultResolver |
| Get vault state                     | `getVaultState(vault)`                          | VaultResolver         |
| Get position by NFT ID              | `positionByNftId(nftId)`                        | VaultResolver         |
| Get all positions for a user        | `positionsByUser(user)`                         | VaultResolver         |
| Get NFT IDs owned by a user         | `positionsNftIdOfUser(user)`                    | VaultResolver         |
| Find vault by NFT ID                | `vaultByNftId(nftId)`                           | VaultResolver         |
| Get liquidation data                | `getVaultLiquidation(vault, tokenInAmt)`        | VaultResolver         |
| Get all liquidation opportunities   | `getAllVaultsLiquidation()`                      | VaultResolver         |
| Get total positions count           | `totalPositions()`                              | VaultResolver         |

### Vault Operations (write — send transactions)

| Action                              | Method                                                            | Vault Type |
| ----------------------------------- | ----------------------------------------------------------------- | ---------- |
| Open/manage position (T1)           | `operate(nftId, newCol, newDebt, to)`                             | T1         |
| Open/manage position (T2)           | `operate(nftId, newColToken0, newColToken1, colSharesMinMax, newDebt, to)` | T2 |
| Open/manage position (T2 perfect)   | `operatePerfect(nftId, perfectColShares, colToken0MinMax, colToken1MinMax, newDebt, to)` | T2 |
| Open/manage position (T3)           | `operate(nftId, newCol, newDebtToken0, newDebtToken1, debtSharesMinMax, to)` | T3 |
| Open/manage position (T3 perfect)   | `operatePerfect(nftId, newCol, perfectDebtShares, debtToken0MinMax, debtToken1MinMax, to)` | T3 |
| Open/manage position (T4)           | `operate(nftId, newColToken0, newColToken1, colSharesMinMax, newDebtToken0, newDebtToken1, debtSharesMinMax, to)` | T4 |
| Open/manage position (T4 perfect)   | `operatePerfect(nftId, perfectColShares, colToken0MinMax, colToken1MinMax, perfectDebtShares, debtToken0MinMax, debtToken1MinMax, to)` | T4 |
| Liquidate position (T1)             | `liquidate(debtAmt, colPerUnitDebt, to, absorb)`                  | T1         |

---

## `operate()` Parameter Guide

The `operate()` function is the primary way to interact with vaults. It handles opening new positions, depositing/withdrawing collateral, and borrowing/repaying debt — all in a single transaction.

### T1: `operate(nftId, newCol, newDebt, to)`

| Parameter | Type      | Description |
| --------- | --------- | ----------- |
| `nftId`   | `uint256` | Position NFT ID. Pass `0` to create a new position. |
| `newCol`  | `int256`  | Collateral change. Positive = deposit, negative = withdraw. |
| `newDebt` | `int256`  | Debt change. Positive = borrow, negative = repay. |
| `to`      | `address` | Recipient for borrowed/withdrawn tokens. `address(0)` = `msg.sender`. |

**Returns:** `(nftId, finalSupplyAmt, finalBorrowAmt)` — the NFT ID (useful when creating new positions) and final supply/borrow amounts (negative = withdraw/payback).

### T2: `operate(nftId, newColToken0, newColToken1, colSharesMinMax, newDebt, to)`

| Parameter          | Type      | Description |
| ------------------ | --------- | ----------- |
| `nftId`            | `uint256` | Position NFT ID. Pass `0` to create a new position. |
| `newColToken0`     | `int256`  | Token0 collateral change. Positive = deposit, negative = withdraw. |
| `newColToken1`     | `int256`  | Token1 collateral change. Positive = deposit, negative = withdraw. |
| `colSharesMinMax`  | `int256`  | Slippage protection. Min shares when depositing (positive), max shares when withdrawing (negative). |
| `newDebt`          | `int256`  | Debt change. Positive = borrow, negative = repay. |
| `to`               | `address` | Recipient for borrowed/withdrawn tokens. |

> T2 also supports `operatePerfect()` for share-denominated operations with exact share amounts.

### T3: `operate(nftId, newCol, newDebtToken0, newDebtToken1, debtSharesMinMax, to)`

| Parameter           | Type      | Description |
| ------------------- | --------- | ----------- |
| `nftId`             | `uint256` | Position NFT ID. Pass `0` to create a new position. |
| `newCol`            | `int256`  | Collateral change. Positive = deposit, negative = withdraw. |
| `newDebtToken0`     | `int256`  | Token0 debt change. Positive = borrow, negative = repay. |
| `newDebtToken1`     | `int256`  | Token1 debt change. Positive = borrow, negative = repay. |
| `debtSharesMinMax`  | `int256`  | Slippage protection. Max shares when borrowing (positive), min shares when repaying (negative). |
| `to`                | `address` | Recipient for borrowed/withdrawn tokens. |

> T3 also supports `operatePerfect()` for share-denominated operations with exact share amounts.

### T4: `operate(nftId, newColToken0, newColToken1, colSharesMinMax, newDebtToken0, newDebtToken1, debtSharesMinMax, to)`

| Parameter           | Type      | Description |
| ------------------- | --------- | ----------- |
| `nftId`             | `uint256` | Position NFT ID. Pass `0` to create a new position. |
| `newColToken0`      | `int256`  | Token0 collateral change. |
| `newColToken1`      | `int256`  | Token1 collateral change. |
| `colSharesMinMax`   | `int256`  | Slippage protection for collateral shares. |
| `newDebtToken0`     | `int256`  | Token0 debt change. |
| `newDebtToken1`     | `int256`  | Token1 debt change. |
| `debtSharesMinMax`  | `int256`  | Slippage protection for debt shares. |
| `to`                | `address` | Recipient for borrowed/withdrawn tokens. |

> T4 also supports `operatePerfect()` for share-denominated operations on both collateral and debt.

### `operatePerfect()` (T2, T3, T4)

The `operatePerfect()` variant lets you specify exact share amounts for DEX LP positions, with the protocol computing the optimal token amounts. Use this when you want precise control over share quantities rather than token amounts.

---

## Contract Addresses (All Verified)

> All contracts are verified on their respective block explorers. Click any link to read the source code directly.

### VaultResolver (read vault data, positions, liquidations)

Address: `0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC` — same on all chains (CREATE2). **Verified.**

| Network  | Explorer (verified source)                                                                     |
| -------- | ---------------------------------------------------------------------------------------------- |
| Ethereum | [Etherscan](https://etherscan.io/address/0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC#code)      |
| Arbitrum | [Arbiscan](https://arbiscan.io/address/0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC#code)        |
| Base     | [Basescan](https://basescan.org/address/0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC#code)       |
| Polygon  | [Polygonscan](https://polygonscan.com/address/0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC#code) |
| Plasma   | [Plasmascan](https://plasmascan.to/address/0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC#code)    |

### VaultFactory (NFT minting, vault creation)

Address: `0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d` — same on all chains (CREATE2). **Verified.**

| Network  | Explorer (verified source)                                                                     |
| -------- | ---------------------------------------------------------------------------------------------- |
| Ethereum | [Etherscan](https://etherscan.io/address/0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d#code)      |
| Arbitrum | [Arbiscan](https://arbiscan.io/address/0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d#code)        |
| Base     | [Basescan](https://basescan.org/address/0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d#code)       |
| Polygon  | [Polygonscan](https://polygonscan.com/address/0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d#code) |
| Plasma   | [Plasmascan](https://plasmascan.to/address/0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d#code)    |

### VaultPositionsResolver

Address: `0xaA21a86030EAa16546A759d2d10fd3bF9D053Bc7` (Ethereum mainnet). **Verified.**

### VaultLiquidationResolver

Address: `0xd8d1a39b1Fe519113b6D8e1E82Dc92aedaD40948` (Ethereum mainnet). **Verified.**

**Source:** [deployments.md](https://github.com/Instadapp/fluid-contracts-public/blob/main/deployments/deployments.md)

### Example Vaults (Ethereum Mainnet)

#### T1 Vaults (Normal Collateral / Normal Debt)

| Vault                | Address                                      | Collateral | Debt   |
| -------------------- | -------------------------------------------- | ---------- | ------ |
| ETH / GHO            | `0xD9A7Dcdc57C6e44f00740dC73664fA456B983669` | ETH        | GHO    |
| wstETH / GHO         | `0xB0F2B58af3F17F1A3377c37F6E85eA41c369D1C7` | wstETH     | GHO    |
| USDC / ETH           | `0x348aD11DB2c90e7FdF8e57420C569F76dBe38a59` | USDC       | ETH    |
| weETH / GHO          | `0xaF40e84C6AD7C214E4d89f63B3c07B3eb99632dF` | weETH      | GHO    |

#### T2 Vaults (Smart Collateral / Normal Debt)

| Vault                         | Address                                      | Collateral (DEX LP) | Debt   |
| ----------------------------- | -------------------------------------------- | ------------------- | ------ |
| DEX-weETH-ETH / wstETH       | `0xb4a15526d427f4d20b0dAdaF3baB4177C85A699A` | weETH-ETH LP        | wstETH |
| DEX-WBTC-cbBTC / USDC        | Check resolver                               | WBTC-cbBTC LP       | USDC   |

#### T3 Vaults (Normal Collateral / Smart Debt)

| Vault                         | Address                                      | Collateral | Debt (DEX LP)  |
| ----------------------------- | -------------------------------------------- | ---------- | -------------- |
| wstETH / DEX-USDC-USDT       | `0x221E35b5655A1eEB3C42c4DeFc39648531f6C9CF` | wstETH     | USDC-USDT LP   |
| ETH / DEX-USDC-USDT          | `0x3E11B9aEb9C7dBbda4DD41477223Cc2f3f24b9d7` | ETH        | USDC-USDT LP   |

#### T4 Vaults (Smart Collateral / Smart Debt)

| Vault                                    | Address                                      | Collateral (DEX LP)  | Debt (DEX LP)    |
| ---------------------------------------- | -------------------------------------------- | -------------------- | ---------------- |
| DEX-wstETH-ETH / DEX-wstETH-ETH         | `0x528CF7DBBff878e02e48E83De5097F8071af768D` | wstETH-ETH LP        | wstETH-ETH LP   |
| DEX-WBTC-cbBTC / DEX-WBTC-cbBTC         | `0xDCe03288F9A109150f314ED0Ca9b59a690300d9d` | WBTC-cbBTC LP        | WBTC-cbBTC LP   |

> Use `getAllVaultsAddresses()` on VaultResolver to get the complete, up-to-date list for any network.

---

## Understanding Vault Data

### VaultEntireData Structure

When you call `getVaultEntireData()`, you receive a comprehensive struct containing:

| Field                      | Description                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `vault`                    | Vault contract address                                                               |
| `isSmartCol`               | `true` if collateral is a Fluid DEX LP position (T2 or T4)                          |
| `isSmartDebt`              | `true` if debt is a Fluid DEX LP position (T3 or T4)                                |
| `constantVariables`        | Immutable vault settings (tokens, factory, liquidity layer, slots)                    |
| `configs`                  | Vault configuration (collateral factor, liquidation threshold, oracle, rates)          |
| `exchangePricesAndRates`   | Current and stored exchange prices, supply/borrow rates at vault and liquidity level   |
| `totalSupplyAndBorrow`     | Aggregate supply/borrow across the vault                                              |
| `limitsAndAvailability`    | Withdrawal limits, borrow limits, and currently available amounts                     |
| `vaultState`               | Total positions, top tick, branch state                                               |
| `liquidityUserSupplyData`  | Supply data at the Liquidity layer (or DEX for smart col)                             |
| `liquidityUserBorrowData`  | Borrow data at the Liquidity layer (or DEX for smart debt)                            |

### Configs

| Field                    | Description                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| `supplyRateMagnifier`    | Multiplier for supply rate (or absolute rate for smart col vaults)             |
| `borrowRateMagnifier`    | Multiplier for borrow rate (or absolute rate for smart debt vaults)            |
| `collateralFactor`       | Max LTV ratio in basis points (e.g., `8000` = 80%)                            |
| `liquidationThreshold`   | LTV at which liquidation begins, in basis points (e.g., `8500` = 85%)         |
| `liquidationMaxLimit`    | Maximum LTV during liquidation, in basis points (e.g., `9000` = 90%)          |
| `withdrawalGap`          | Safety gap for withdrawals, in basis points                                    |
| `liquidationPenalty`     | Penalty applied during liquidation, in basis points                            |
| `borrowFee`              | One-time fee on new borrows, in basis points                                   |
| `oracle`                 | Oracle contract address (returns debt-per-collateral price)                    |
| `oraclePriceOperate`     | Current oracle price for operations (debt amount per 1 unit of collateral)     |
| `oraclePriceLiquidate`   | Current oracle price for liquidations                                          |

### Exchange Prices and Rates

| Field                       | Description                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| `liquiditySupplyExchangePrice` | Current supply exchange price at liquidity layer (1e12 for smart col)      |
| `liquidityBorrowExchangePrice` | Current borrow exchange price at liquidity layer (1e12 for smart debt)     |
| `vaultSupplyExchangePrice`     | Current supply exchange price at the vault level                           |
| `vaultBorrowExchangePrice`     | Current borrow exchange price at the vault level                           |
| `supplyRateLiquidity`          | Supply interest rate at liquidity layer (0 for smart col)                  |
| `borrowRateLiquidity`          | Borrow interest rate at liquidity layer (0 for smart debt)                 |
| `supplyRateVault`              | Effective supply rate at the vault (can be negative for smart col)         |
| `borrowRateVault`              | Effective borrow rate at the vault (can be negative for smart debt)        |
| `rewardsOrFeeRateSupply`       | Rewards (positive) or fee (negative) rate for supply, in 1e2 precision     |
| `rewardsOrFeeRateBorrow`       | Rewards (negative) or fee (positive) rate for borrow, in 1e2 precision     |

### Understanding Vault Rates

For **normal collateral/debt** vaults (T1):
- `supplyRateVault = supplyRateLiquidity * supplyRateMagnifier / 10000`
- `borrowRateVault = borrowRateLiquidity * borrowRateMagnifier / 10000`
- `rewardsOrFeeRate` is the relative % difference from the liquidity rate

For **smart collateral/debt** vaults (T2, T3, T4):
- The magnifier bits store the absolute interest rate
- `supplyRateVault == rewardsOrFeeRateSupply` (for smart col)
- `borrowRateVault == rewardsOrFeeRateBorrow` (for smart debt)
- Full rates require combining with DEX resolver data

Rates are in **basis points** (1 bp = 0.01%, `10000` = 100%):

```javascript
const borrowRateVault = Number(result.exchangePricesAndRates.borrowRateVault);
const borrowApr = borrowRateVault / 100; // e.g. 450 → 4.50%

const collateralFactor = Number(result.configs.collateralFactor);
const maxLtv = collateralFactor / 100; // e.g. 8000 → 80%
```

### UserPosition Structure

| Field             | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `nftId`           | Position NFT ID                                                     |
| `owner`           | Current owner address                                               |
| `isLiquidated`    | Whether the position has been (partially) liquidated                |
| `isSupplyPosition`| `true` if supply-only (no borrow)                                   |
| `tick`            | Current tick of the position (debt/collateral ratio)                |
| `tickId`          | ID within the tick                                                  |
| `supply`          | Current collateral amount (in token units or shares for smart col)  |
| `borrow`          | Current debt amount (in token units or shares for smart debt)       |
| `dustBorrow`      | Dust borrow amount (very small residual)                            |
| `beforeSupply`    | Collateral before any liquidation adjustments                       |
| `beforeBorrow`    | Debt before any liquidation adjustments                             |
| `beforeDustBorrow`| Dust borrow before adjustments                                      |

---

## Code Examples (viem/Node.js)

### Open a T1 Vault Position (Deposit ETH + Borrow GHO)

```javascript
import { createWalletClient, createPublicClient, http, parseEther, parseUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const VAULT_T1_ETH_GHO = '0xD9A7Dcdc57C6e44f00740dC73664fA456B983669';

const vaultT1Abi = [
  {
    name: 'operate',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'nftId_', type: 'uint256' },
      { name: 'newCol_', type: 'int256' },
      { name: 'newDebt_', type: 'int256' },
      { name: 'to_', type: 'address' },
    ],
    outputs: [
      { type: 'uint256' },
      { type: 'int256' },
      { type: 'int256' },
    ],
  },
];

async function openPosition() {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY);

  const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(process.env.ETH_RPC_URL),
  });

  const collateralAmount = parseEther('1'); // 1 ETH
  const borrowAmount = parseUnits('2000', 18); // 2000 GHO (18 decimals)

  // nftId = 0 → create new position
  // newCol = positive → deposit
  // newDebt = positive → borrow
  const hash = await walletClient.writeContract({
    address: VAULT_T1_ETH_GHO,
    abi: vaultT1Abi,
    functionName: 'operate',
    args: [0n, collateralAmount, borrowAmount, account.address],
    value: collateralAmount, // send ETH as value for native collateral
  });

  console.log(`Transaction: ${hash}`);
}

openPosition().catch(console.error);
```

### Query User Vault Positions

```javascript
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const VAULT_RESOLVER = '0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC';

const vaultResolverAbi = [
  {
    name: 'positionsNftIdOfUser',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user_', type: 'address' }],
    outputs: [{ type: 'uint256[]' }],
  },
  {
    name: 'getAllVaultsAddresses',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address[]' }],
  },
  {
    name: 'getVaultType',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'vault_', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
];

async function main() {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(process.env.ETH_RPC_URL),
  });

  // Get all position NFT IDs
  const nftIds = await client.readContract({
    address: VAULT_RESOLVER,
    abi: vaultResolverAbi,
    functionName: 'positionsNftIdOfUser',
    args: ['0xYourAddress'],
  });

  console.log(`User has ${nftIds.length} vault positions: [${nftIds.join(', ')}]`);
}

main().catch(console.error);
```

---

## Common Patterns

### Check vault health before operating

```javascript
const vaultData = await client.readContract({
  address: VAULT_RESOLVER,
  abi: vaultResolverAbi,
  functionName: 'getVaultEntireData',
  args: [vaultAddress],
});

const collateralFactor = Number(vaultData.configs.collateralFactor) / 100; // e.g. 80%
const liquidationThreshold = Number(vaultData.configs.liquidationThreshold) / 100; // e.g. 85%
const borrowRate = Number(vaultData.exchangePricesAndRates.borrowRateVault) / 100; // e.g. 4.5%

console.log(`Max LTV: ${collateralFactor}%`);
console.log(`Liquidation at: ${liquidationThreshold}%`);
console.log(`Borrow APR: ${borrowRate}%`);
```

### Check borrowing limits

```javascript
const { limitsAndAvailability } = vaultData;

const borrowable = limitsAndAvailability.borrowable;
const borrowLimit = limitsAndAvailability.borrowLimit;
const withdrawable = limitsAndAvailability.withdrawable;

console.log(`Currently borrowable: ${borrowable}`);
console.log(`Borrow limit: ${borrowLimit}`);
console.log(`Currently withdrawable: ${withdrawable}`);

// Check minimum borrow amount
const minimumBorrowing = limitsAndAvailability.minimumBorrowing;
if (borrowAmount < minimumBorrowing) {
  throw new Error(`Amount below minimum borrow: ${minimumBorrowing}`);
}
```

### Fetch liquidation opportunities

```javascript
// Get liquidation data for a specific vault
const liquidationData = await client.readContract({
  address: VAULT_RESOLVER,
  abi: vaultResolverAbi,
  functionName: 'getVaultLiquidation',
  args: [vaultAddress, 0n], // 0 = get max available
});

if (liquidationData.inAmt > 0n) {
  console.log(`Liquidation available!`);
  console.log(`  Debt to pay: ${liquidationData.inAmt}`);
  console.log(`  Collateral received: ${liquidationData.outAmt}`);
  console.log(`  Absorb available: ${liquidationData.absorbAvailable}`);
}
```

### Transfer a position NFT

Vault positions are ERC-721 NFTs on the VaultFactory. Transfer them like any NFT:

```javascript
const VAULT_FACTORY = '0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d';

await walletClient.writeContract({
  address: VAULT_FACTORY,
  abi: [
    {
      name: 'transferFrom',
      type: 'function',
      inputs: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
      ],
      outputs: [],
    },
  ],
  functionName: 'transferFrom',
  args: [fromAddress, toAddress, nftId],
});
```

---

## Key Concepts

### NFT Positions

Every vault position is an ERC-721 NFT minted by the VaultFactory (`0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d`). The NFT ID uniquely identifies a position across all vaults and chains. Positions can be transferred by transferring the NFT.

### Collateral Factor & Liquidation

- **Collateral Factor** (e.g., 80%): Maximum loan-to-value ratio for operating (borrowing, withdrawing).
- **Liquidation Threshold** (e.g., 85%): LTV at which the position becomes liquidatable.
- **Liquidation Max Limit** (e.g., 90%): Hard upper bound — positions cannot exceed this LTV.
- **Liquidation Penalty** (e.g., 5%): Discount given to liquidators as incentive.

### Oracle Pricing

The oracle returns the price as **debt per unit of collateral** (i.e., how much debt 1 unit of collateral is worth). For smart collateral/debt vaults, this price is expressed in shares rather than underlying tokens:
- **T1**: debt token per 1 collateral token
- **T2**: debt token per 1 collateral share
- **T3**: debt shares per 1 collateral token
- **T4**: debt shares per 1 collateral share

### Exchange Prices

Vault exchange prices convert between raw (stored) amounts and actual token amounts. They increase over time as interest accrues. Precision is `1e12`.

### Withdrawal & Borrow Limits

Fluid implements expanding limits to protect against sudden large withdrawals or borrows:
- **Withdrawal Limit**: Starts at `baseWithdrawalLimit` and expands by `expandPercent` over `expandDuration`.
- **Borrow Limit**: Similarly expands over time. Check `limitsAndAvailability.borrowable` for the current available amount.
- Always check limits before large operations using the resolver.

### Smart Collateral & Smart Debt (T2, T3, T4)

When collateral or debt is "smart", it is a Fluid DEX LP position rather than a single token. This means:
- **Amounts are in shares**, not token amounts
- Token0 and token1 addresses are available in `constantVariables.supplyToken` / `constantVariables.borrowToken`
- For full rate calculations, combine vault resolver data with DexResolver data
- `operatePerfect()` lets you specify exact share amounts

### Dust Borrow

A small "dust" borrow amount may exist in positions. This is a protocol mechanism to handle rounding. The `dustBorrow` field in UserPosition shows this amount.

---

## ABIs

### VaultResolver ABI (key methods)

```json
[
  {
    "name": "getAllVaultsAddresses",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "address[]" }]
  },
  {
    "name": "getTotalVaults",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "getVaultType",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "vault_", "type": "address" }],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "getVaultEntireData",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "vault_", "type": "address" }],
    "outputs": [
      {
        "type": "tuple",
        "components": [
          { "name": "vault", "type": "address" },
          { "name": "isSmartCol", "type": "bool" },
          { "name": "isSmartDebt", "type": "bool" },
          {
            "name": "constantVariables",
            "type": "tuple",
            "components": [
              { "name": "liquidity", "type": "address" },
              { "name": "factory", "type": "address" },
              { "name": "operateImplementation", "type": "address" },
              { "name": "adminImplementation", "type": "address" },
              { "name": "secondaryImplementation", "type": "address" },
              { "name": "deployer", "type": "address" },
              { "name": "supply", "type": "address" },
              { "name": "borrow", "type": "address" },
              {
                "name": "supplyToken",
                "type": "tuple",
                "components": [
                  { "name": "token0", "type": "address" },
                  { "name": "token1", "type": "address" }
                ]
              },
              {
                "name": "borrowToken",
                "type": "tuple",
                "components": [
                  { "name": "token0", "type": "address" },
                  { "name": "token1", "type": "address" }
                ]
              },
              { "name": "vaultId", "type": "uint256" },
              { "name": "vaultType", "type": "uint256" },
              { "name": "supplyExchangePriceSlot", "type": "bytes32" },
              { "name": "borrowExchangePriceSlot", "type": "bytes32" },
              { "name": "userSupplySlot", "type": "bytes32" },
              { "name": "userBorrowSlot", "type": "bytes32" }
            ]
          },
          {
            "name": "configs",
            "type": "tuple",
            "components": [
              { "name": "supplyRateMagnifier", "type": "uint16" },
              { "name": "borrowRateMagnifier", "type": "uint16" },
              { "name": "collateralFactor", "type": "uint16" },
              { "name": "liquidationThreshold", "type": "uint16" },
              { "name": "liquidationMaxLimit", "type": "uint16" },
              { "name": "withdrawalGap", "type": "uint16" },
              { "name": "liquidationPenalty", "type": "uint16" },
              { "name": "borrowFee", "type": "uint16" },
              { "name": "oracle", "type": "address" },
              { "name": "oraclePriceOperate", "type": "uint256" },
              { "name": "oraclePriceLiquidate", "type": "uint256" },
              { "name": "rebalancer", "type": "address" },
              { "name": "lastUpdateTimestamp", "type": "uint256" }
            ]
          },
          {
            "name": "exchangePricesAndRates",
            "type": "tuple",
            "components": [
              { "name": "lastStoredLiquiditySupplyExchangePrice", "type": "uint256" },
              { "name": "lastStoredLiquidityBorrowExchangePrice", "type": "uint256" },
              { "name": "lastStoredVaultSupplyExchangePrice", "type": "uint256" },
              { "name": "lastStoredVaultBorrowExchangePrice", "type": "uint256" },
              { "name": "liquiditySupplyExchangePrice", "type": "uint256" },
              { "name": "liquidityBorrowExchangePrice", "type": "uint256" },
              { "name": "vaultSupplyExchangePrice", "type": "uint256" },
              { "name": "vaultBorrowExchangePrice", "type": "uint256" },
              { "name": "supplyRateLiquidity", "type": "uint256" },
              { "name": "borrowRateLiquidity", "type": "uint256" },
              { "name": "supplyRateVault", "type": "int256" },
              { "name": "borrowRateVault", "type": "int256" },
              { "name": "rewardsOrFeeRateSupply", "type": "int256" },
              { "name": "rewardsOrFeeRateBorrow", "type": "int256" }
            ]
          },
          {
            "name": "totalSupplyAndBorrow",
            "type": "tuple",
            "components": [
              { "name": "totalSupplyVault", "type": "uint256" },
              { "name": "totalBorrowVault", "type": "uint256" },
              { "name": "totalSupplyLiquidityOrDex", "type": "uint256" },
              { "name": "totalBorrowLiquidityOrDex", "type": "uint256" },
              { "name": "absorbedSupply", "type": "uint256" },
              { "name": "absorbedBorrow", "type": "uint256" }
            ]
          },
          {
            "name": "limitsAndAvailability",
            "type": "tuple",
            "components": [
              { "name": "withdrawLimit", "type": "uint256" },
              { "name": "withdrawableUntilLimit", "type": "uint256" },
              { "name": "withdrawable", "type": "uint256" },
              { "name": "borrowLimit", "type": "uint256" },
              { "name": "borrowableUntilLimit", "type": "uint256" },
              { "name": "borrowable", "type": "uint256" },
              { "name": "borrowLimitUtilization", "type": "uint256" },
              { "name": "minimumBorrowing", "type": "uint256" }
            ]
          },
          {
            "name": "vaultState",
            "type": "tuple",
            "components": [
              { "name": "totalPositions", "type": "uint256" },
              { "name": "topTick", "type": "int256" },
              { "name": "currentBranch", "type": "uint256" },
              { "name": "totalBranch", "type": "uint256" },
              { "name": "totalBorrow", "type": "uint256" },
              { "name": "totalSupply", "type": "uint256" },
              {
                "name": "currentBranchState",
                "type": "tuple",
                "components": [
                  { "name": "status", "type": "uint256" },
                  { "name": "minimaTick", "type": "int256" },
                  { "name": "debtFactor", "type": "uint256" },
                  { "name": "partials", "type": "uint256" },
                  { "name": "debtLiquidity", "type": "uint256" },
                  { "name": "baseBranchId", "type": "uint256" },
                  { "name": "baseBranchMinima", "type": "int256" }
                ]
              }
            ]
          },
          {
            "name": "liquidityUserSupplyData",
            "type": "tuple",
            "components": [
              { "name": "modeWithInterest", "type": "bool" },
              { "name": "supply", "type": "uint256" },
              { "name": "withdrawalLimit", "type": "uint256" },
              { "name": "lastUpdateTimestamp", "type": "uint256" },
              { "name": "expandPercent", "type": "uint256" },
              { "name": "expandDuration", "type": "uint256" },
              { "name": "baseWithdrawalLimit", "type": "uint256" },
              { "name": "withdrawableUntilLimit", "type": "uint256" },
              { "name": "withdrawable", "type": "uint256" }
            ]
          },
          {
            "name": "liquidityUserBorrowData",
            "type": "tuple",
            "components": [
              { "name": "modeWithInterest", "type": "bool" },
              { "name": "borrow", "type": "uint256" },
              { "name": "borrowLimit", "type": "uint256" },
              { "name": "lastUpdateTimestamp", "type": "uint256" },
              { "name": "expandPercent", "type": "uint256" },
              { "name": "expandDuration", "type": "uint256" },
              { "name": "baseBorrowLimit", "type": "uint256" },
              { "name": "maxBorrowLimit", "type": "uint256" },
              { "name": "borrowableUntilLimit", "type": "uint256" },
              { "name": "borrowable", "type": "uint256" },
              { "name": "borrowLimitUtilization", "type": "uint256" }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "positionByNftId",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "nftId_", "type": "uint256" }],
    "outputs": [
      {
        "name": "userPosition_",
        "type": "tuple",
        "components": [
          { "name": "nftId", "type": "uint256" },
          { "name": "owner", "type": "address" },
          { "name": "isLiquidated", "type": "bool" },
          { "name": "isSupplyPosition", "type": "bool" },
          { "name": "tick", "type": "int256" },
          { "name": "tickId", "type": "uint256" },
          { "name": "beforeSupply", "type": "uint256" },
          { "name": "beforeBorrow", "type": "uint256" },
          { "name": "beforeDustBorrow", "type": "uint256" },
          { "name": "supply", "type": "uint256" },
          { "name": "borrow", "type": "uint256" },
          { "name": "dustBorrow", "type": "uint256" }
        ]
      },
      {
        "name": "vaultData_",
        "type": "tuple",
        "components": "...same as getVaultEntireData output..."
      }
    ]
  },
  {
    "name": "positionsByUser",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "user_", "type": "address" }],
    "outputs": [
      { "name": "userPositions_", "type": "tuple[]", "components": "...same as UserPosition..." },
      { "name": "vaultsData_", "type": "tuple[]", "components": "...same as VaultEntireData..." }
    ]
  },
  {
    "name": "positionsNftIdOfUser",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "user_", "type": "address" }],
    "outputs": [{ "type": "uint256[]" }]
  },
  {
    "name": "vaultByNftId",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "nftId_", "type": "uint256" }],
    "outputs": [{ "type": "address" }]
  },
  {
    "name": "getVaultLiquidation",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "vault_", "type": "address" },
      { "name": "tokenInAmt_", "type": "uint256" }
    ],
    "outputs": [
      {
        "type": "tuple",
        "components": [
          { "name": "vault", "type": "address" },
          { "name": "token0In", "type": "address" },
          { "name": "token0Out", "type": "address" },
          { "name": "token1In", "type": "address" },
          { "name": "token1Out", "type": "address" },
          { "name": "inAmt", "type": "uint256" },
          { "name": "outAmt", "type": "uint256" },
          { "name": "inAmtWithAbsorb", "type": "uint256" },
          { "name": "outAmtWithAbsorb", "type": "uint256" },
          { "name": "absorbAvailable", "type": "bool" }
        ]
      }
    ]
  },
  {
    "name": "totalPositions",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "uint256" }]
  }
]
```

### VaultT1 ABI

```json
[
  {
    "name": "operate",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "nftId_", "type": "uint256" },
      { "name": "newCol_", "type": "int256" },
      { "name": "newDebt_", "type": "int256" },
      { "name": "to_", "type": "address" }
    ],
    "outputs": [
      { "name": "nftId", "type": "uint256" },
      { "name": "supplyAmt", "type": "int256" },
      { "name": "borrowAmt", "type": "int256" }
    ]
  },
  {
    "name": "liquidate",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "debtAmt_", "type": "uint256" },
      { "name": "colPerUnitDebt_", "type": "uint256" },
      { "name": "to_", "type": "address" },
      { "name": "absorb_", "type": "bool" }
    ],
    "outputs": [
      { "name": "actualDebtAmt_", "type": "uint256" },
      { "name": "actualColAmt_", "type": "uint256" }
    ]
  },
  {
    "name": "constantsView",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [
      {
        "type": "tuple",
        "components": [
          { "name": "liquidity", "type": "address" },
          { "name": "factory", "type": "address" },
          { "name": "adminImplementation", "type": "address" },
          { "name": "secondaryImplementation", "type": "address" },
          { "name": "supplyToken", "type": "address" },
          { "name": "borrowToken", "type": "address" },
          { "name": "supplyDecimals", "type": "uint8" },
          { "name": "borrowDecimals", "type": "uint8" },
          { "name": "vaultId", "type": "uint256" },
          { "name": "liquiditySupplyExchangePriceSlot", "type": "bytes32" },
          { "name": "liquidityBorrowExchangePriceSlot", "type": "bytes32" },
          { "name": "liquidityUserSupplySlot", "type": "bytes32" },
          { "name": "liquidityUserBorrowSlot", "type": "bytes32" }
        ]
      }
    ]
  },
  {
    "name": "VAULT_ID",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "uint256" }]
  }
]
```

### VaultT2 ABI (Smart Collateral)

```json
[
  {
    "name": "operate",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "nftId_", "type": "uint256" },
      { "name": "newColToken0_", "type": "int256" },
      { "name": "newColToken1_", "type": "int256" },
      { "name": "colSharesMinMax_", "type": "int256" },
      { "name": "newDebt_", "type": "int256" },
      { "name": "to_", "type": "address" }
    ],
    "outputs": [
      { "name": "nftId", "type": "uint256" },
      { "name": "supplyAmt", "type": "int256" },
      { "name": "borrowAmt", "type": "int256" }
    ]
  },
  {
    "name": "operatePerfect",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "nftId_", "type": "uint256" },
      { "name": "perfectColShares_", "type": "int256" },
      { "name": "colToken0MinMax_", "type": "int256" },
      { "name": "colToken1MinMax_", "type": "int256" },
      { "name": "newDebt_", "type": "int256" },
      { "name": "to_", "type": "address" }
    ],
    "outputs": [
      { "name": "nftId", "type": "uint256" },
      { "name": "r", "type": "int256[]" }
    ]
  }
]
```

### VaultT3 ABI (Smart Debt)

```json
[
  {
    "name": "operate",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "nftId_", "type": "uint256" },
      { "name": "newCol_", "type": "int256" },
      { "name": "newDebtToken0_", "type": "int256" },
      { "name": "newDebtToken1_", "type": "int256" },
      { "name": "debtSharesMinMax_", "type": "int256" },
      { "name": "to_", "type": "address" }
    ],
    "outputs": [
      { "name": "nftId", "type": "uint256" },
      { "name": "supplyAmt", "type": "int256" },
      { "name": "borrowAmt", "type": "int256" }
    ]
  },
  {
    "name": "operatePerfect",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "nftId_", "type": "uint256" },
      { "name": "newCol_", "type": "int256" },
      { "name": "perfectDebtShares_", "type": "int256" },
      { "name": "debtToken0MinMax_", "type": "int256" },
      { "name": "debtToken1MinMax_", "type": "int256" },
      { "name": "to_", "type": "address" }
    ],
    "outputs": [
      { "name": "nftId", "type": "uint256" },
      { "name": "r", "type": "int256[]" }
    ]
  }
]
```

### VaultT4 ABI (Smart Collateral + Smart Debt)

```json
[
  {
    "name": "operate",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "nftId_", "type": "uint256" },
      { "name": "newColToken0_", "type": "int256" },
      { "name": "newColToken1_", "type": "int256" },
      { "name": "colSharesMinMax_", "type": "int256" },
      { "name": "newDebtToken0_", "type": "int256" },
      { "name": "newDebtToken1_", "type": "int256" },
      { "name": "debtSharesMinMax_", "type": "int256" },
      { "name": "to_", "type": "address" }
    ],
    "outputs": [
      { "name": "nftId", "type": "uint256" },
      { "name": "supplyAmt", "type": "int256" },
      { "name": "borrowAmt", "type": "int256" }
    ]
  },
  {
    "name": "operatePerfect",
    "type": "function",
    "stateMutability": "payable",
    "inputs": [
      { "name": "nftId_", "type": "uint256" },
      { "name": "perfectColShares_", "type": "int256" },
      { "name": "colToken0MinMax_", "type": "int256" },
      { "name": "colToken1MinMax_", "type": "int256" },
      { "name": "perfectDebtShares_", "type": "int256" },
      { "name": "debtToken0MinMax_", "type": "int256" },
      { "name": "debtToken1MinMax_", "type": "int256" },
      { "name": "to_", "type": "address" }
    ],
    "outputs": [
      { "name": "nftId", "type": "uint256" },
      { "name": "r", "type": "int256[]" }
    ]
  }
]
```

### VaultFactory ABI (ERC-721)

```json
[
  {
    "name": "ownerOf",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "type": "address" }]
  },
  {
    "name": "balanceOf",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "owner", "type": "address" }],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "tokenOfOwnerByIndex",
    "type": "function",
    "stateMutability": "view",
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "index", "type": "uint256" }
    ],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "totalSupply",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "totalVaults",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "getVaultAddress",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "vaultId", "type": "uint256" }],
    "outputs": [{ "type": "address" }]
  },
  {
    "name": "transferFrom",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "from", "type": "address" },
      { "name": "to", "type": "address" },
      { "name": "tokenId", "type": "uint256" }
    ],
    "outputs": []
  }
]
```

____

# Complete Working Examples

These are copy-paste-ready scripts. Install dependencies: `npm install viem`

## Example 1: Lend USDC on Base (deposit + check position)

```javascript
import { createPublicClient, createWalletClient, http, parseUnits, formatUnits } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// --- Config ---
const RPC_URL = 'https://mainnet.base.org';
const LENDING_RESOLVER = '0x48D32f49aFeAEC7AE66ad7B9264f446fc11a1569';
const account = privateKeyToAccount(process.env.PRIVATE_KEY);

const client = createPublicClient({ chain: base, transport: http(RPC_URL) });
const wallet = createWalletClient({ account, chain: base, transport: http(RPC_URL) });

// Step 1: Find fUSDC address on Base via resolver
const resolverAbi = [
  {
    name: 'getAllFTokens', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'address[]' }],
  },
  {
    name: 'getFTokenDetails', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'fToken_', type: 'address' }],
    outputs: [{ type: 'tuple', components: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'eip2612Deposits', type: 'bool' },
      { name: 'isNativeUnderlying', type: 'bool' },
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'decimals', type: 'uint256' },
      { name: 'asset', type: 'address' },
      { name: 'totalAssets', type: 'uint256' },
      { name: 'totalSupply', type: 'uint256' },
      { name: 'convertToShares', type: 'uint256' },
      { name: 'convertToAssets', type: 'uint256' },
      { name: 'rewardsRate', type: 'uint256' },
      { name: 'supplyRate', type: 'uint256' },
      { name: 'rebalanceDifference', type: 'int256' },
      { name: 'liquidityUserSupplyData', type: 'tuple', components: [] },
    ]}],
  },
  {
    name: 'getUserPosition', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'fToken_', type: 'address' }, { name: 'user_', type: 'address' }],
    outputs: [{ type: 'tuple', components: [
      { name: 'fTokenShares', type: 'uint256' },
      { name: 'underlyingAssets', type: 'uint256' },
      { name: 'underlyingBalance', type: 'uint256' },
      { name: 'allowance', type: 'uint256' },
    ]}],
  },
];

const erc20Abi = [
  {
    name: 'approve', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ type: 'bool' }],
  },
];

const fTokenAbi = [
  {
    name: 'deposit', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'assets', type: 'uint256' }, { name: 'receiver', type: 'address' }],
    outputs: [{ name: 'shares', type: 'uint256' }],
  },
];

async function lendUSDC() {
  // 1. Discover fTokens
  const fTokens = await client.readContract({
    address: LENDING_RESOLVER, abi: resolverAbi, functionName: 'getAllFTokens',
  });
  console.log(`Found ${fTokens.length} fTokens on Base`);

  // 2. Find fUSDC by checking each fToken's symbol
  let fUsdcAddress;
  for (const ft of fTokens) {
    const details = await client.readContract({
      address: LENDING_RESOLVER, abi: resolverAbi, functionName: 'getFTokenDetails', args: [ft],
    });
    if (details.symbol === 'fUSDC') {
      fUsdcAddress = ft;
      const apr = Number(details.supplyRate) / 100;
      const rewards = Number(details.rewardsRate) / 100;
      console.log(`Found fUSDC at ${ft} | APR: ${apr}% + ${rewards}% rewards = ${apr + rewards}%`);
      console.log(`TVL: ${formatUnits(details.totalAssets, 6)} USDC`);
      break;
    }
  }
  if (!fUsdcAddress) throw new Error('fUSDC not found on this chain');

  // 3. Approve + Deposit 100 USDC
  const amount = parseUnits('100', 6); // 100 USDC
  const usdcAddress = (await client.readContract({
    address: LENDING_RESOLVER, abi: resolverAbi, functionName: 'getFTokenDetails', args: [fUsdcAddress],
  })).asset;

  console.log(`Approving ${formatUnits(amount, 6)} USDC...`);
  const approveTx = await wallet.writeContract({
    address: usdcAddress, abi: erc20Abi, functionName: 'approve',
    args: [fUsdcAddress, amount],
  });
  await client.waitForTransactionReceipt({ hash: approveTx });

  console.log(`Depositing ${formatUnits(amount, 6)} USDC into fUSDC...`);
  const depositTx = await wallet.writeContract({
    address: fUsdcAddress, abi: fTokenAbi, functionName: 'deposit',
    args: [amount, account.address],
  });
  const receipt = await client.waitForTransactionReceipt({ hash: depositTx });
  console.log(`Deposited! Tx: ${receipt.transactionHash} | Block: ${receipt.blockNumber}`);

  // 4. Check position
  const position = await client.readContract({
    address: LENDING_RESOLVER, abi: resolverAbi, functionName: 'getUserPosition',
    args: [fUsdcAddress, account.address],
  });
  console.log(`Position — Shares: ${position.fTokenShares}, Worth: ${formatUnits(position.underlyingAssets, 6)} USDC`);
}

lendUSDC().catch(console.error);
```

## Example 2: Borrow from a Vault on Base (deposit collateral + borrow)

```javascript
import { createPublicClient, createWalletClient, http, parseEther, parseUnits, formatUnits, formatEther } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// --- Config ---
const RPC_URL = 'https://mainnet.base.org';
const VAULT_RESOLVER = '0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC';
const account = privateKeyToAccount(process.env.PRIVATE_KEY);

const client = createPublicClient({ chain: base, transport: http(RPC_URL) });
const wallet = createWalletClient({ account, chain: base, transport: http(RPC_URL) });

const vaultResolverAbi = [
  {
    name: 'getAllVaultsAddresses', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'address[]' }],
  },
  {
    name: 'getVaultType', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'vault_', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'positionsNftIdOfUser', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'user_', type: 'address' }],
    outputs: [{ type: 'uint256[]' }],
  },
];

const vaultT1Abi = [
  {
    name: 'operate', type: 'function', stateMutability: 'payable',
    inputs: [
      { name: 'nftId_', type: 'uint256' },
      { name: 'newCol_', type: 'int256' },
      { name: 'newDebt_', type: 'int256' },
      { name: 'to_', type: 'address' },
    ],
    outputs: [
      { name: 'nftId', type: 'uint256' },
      { name: 'supplyAmt', type: 'int256' },
      { name: 'borrowAmt', type: 'int256' },
    ],
  },
];

async function borrowFromVault() {
  // 1. Discover vaults on Base
  const vaults = await client.readContract({
    address: VAULT_RESOLVER, abi: vaultResolverAbi, functionName: 'getAllVaultsAddresses',
  });
  console.log(`Found ${vaults.length} vaults on Base`);

  // 2. Find a T1 vault (simplest)
  let t1Vault;
  for (const v of vaults) {
    const vType = await client.readContract({
      address: VAULT_RESOLVER, abi: vaultResolverAbi, functionName: 'getVaultType', args: [v],
    });
    if (vType === 10000n) {
      t1Vault = v;
      console.log(`Found T1 vault: ${v}`);
      break;
    }
  }
  if (!t1Vault) throw new Error('No T1 vault found on this chain');

  // 3. Open position: deposit 0.1 ETH collateral, borrow 100 USDC
  const collateral = parseEther('0.1');
  const borrow = parseUnits('100', 6); // USDC has 6 decimals

  console.log(`Opening vault position...`);
  console.log(`  Collateral: ${formatEther(collateral)} ETH`);
  console.log(`  Borrow: ${formatUnits(borrow, 6)} USDC`);

  const tx = await wallet.writeContract({
    address: t1Vault,
    abi: vaultT1Abi,
    functionName: 'operate',
    args: [
      0n,           // nftId = 0 → new position
      collateral,   // deposit ETH
      BigInt(borrow), // borrow USDC
      account.address,
    ],
    value: collateral, // send ETH with the transaction
  });

  const receipt = await client.waitForTransactionReceipt({ hash: tx });
  console.log(`Position opened! Tx: ${receipt.transactionHash}`);

  // 4. Check our positions
  const nftIds = await client.readContract({
    address: VAULT_RESOLVER, abi: vaultResolverAbi,
    functionName: 'positionsNftIdOfUser', args: [account.address],
  });
  console.log(`You now have ${nftIds.length} vault position(s): [${nftIds.join(', ')}]`);
}

borrowFromVault().catch(console.error);
```

> **Both examples work on Base.** Set `PRIVATE_KEY` env var and run with `node --experimental-modules script.mjs`.

____

# Resources

## Lending

- [LendingResolver Source](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/periphery/resolvers/lending/main.sol)
- [LendingFactory Source](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/protocols/lending/lendingFactory/main.sol)
- [iFToken Interface](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/protocols/lending/interfaces/iFToken.sol)
- [iLendingResolver Interface](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/periphery/resolvers/lending/iLendingResolver.sol)
- [Resolver Structs (Lending)](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/periphery/resolvers/lending/structs.sol)

## Vaults

- [VaultResolver Source](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/periphery/resolvers/vault/main.sol)
- [iVaultResolver Interface](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/periphery/resolvers/vault/iVaultResolver.sol)
- [Resolver Structs (Vault)](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/periphery/resolvers/vault/structs.sol)
- [iVault Interface (common)](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/protocols/vault/interfaces/iVault.sol)
- [iVaultT1 Interface](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/protocols/vault/interfaces/iVaultT1.sol)
- [iVaultT2 Interface](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/protocols/vault/interfaces/iVaultT2.sol)
- [iVaultT3 Interface](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/protocols/vault/interfaces/iVaultT3.sol)
- [iVaultT4 Interface](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/protocols/vault/interfaces/iVaultT4.sol)
- [VaultFactory Interface](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/protocols/vault/interfaces/iVaultFactory.sol)
- [VaultFactory Source](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/protocols/vault/factory/main.sol)

## General

- [Fluid Docs](https://docs.fluid.instadapp.io/)
- [Fluid Integration Docs](https://fluid-integration-docs.vercel.app/)
- [Contract Addresses](https://docs.fluid.instadapp.io/contracts/contract-addresses.html)
- [Deployments (all chains)](https://github.com/Instadapp/fluid-contracts-public/blob/main/deployments/deployments.md)
- [GitHub: fluid-contracts-public](https://github.com/Instadapp/fluid-contracts-public)
