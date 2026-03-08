# Clawlett

<p align="center">
  <img src="assets/mascot.jpg" alt="Clawlett Mascot" width="400">
</p>

An [OpenClaw](https://openclaw.ai) skill for autonomous token swaps and Trenches trading, powered by Gnosis Safe + Zodiac Roles.

**Supported chains:** Base (default), BNB Chain. All scripts accept `--chain <name>`.

## Overview

This skill enables AI agents to perform secure, permissioned token swaps and Trenches token creation/trading through a Gnosis Safe. The agent operates through Zodiac Roles module which restricts operations to:

- Swapping tokens via KyberSwap Aggregator (default) or CoW Protocol (MEV-protected)
- Creating tokens on Trenches
- Buying and selling Trenches tokens via factory
- Approving tokens only for KyberSwap Router, CoW Vault Relayer, and AgentKeyFactoryV3
- All swapped tokens return to the Safe (no external transfers)

The human owner retains full control of the Safe while the agent can only execute swaps and trades.

## Security Model

```
┌─────────────────────────────────────────────────────────┐
│                     Gnosis Safe                         │
│                  (holds all funds)                      │
│                                                         │
│  Owner: Human Wallet (full control)                     │
│  Module: Zodiac Roles (restricted agent access)         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Zodiac Roles                          │
│                                                         │
│  Agent can ONLY:                                        │
│  • Call ZodiacHelpers (swaps, approvals, wrapping)      │
│  • Approve tokens for KyberSwap Router & CoW Relayer    │
│  • Execute swaps via KyberSwap or CoW Protocol          │
│                                                         │
│  Agent CANNOT:                                          │
│  • Transfer tokens out of Safe                          │
│  • Change Safe settings                                 │
│  • Add/remove owners                                    │
└─────────────────────────────────────────────────────────┘
```

## Installation

```bash
cd clawlett/scripts
npm install
```

## Setup

1. Initialize the wallet (deploys Safe + Roles):

```bash
node clawlett/scripts/initialize.js --owner <YOUR_WALLET_ADDRESS>
# Or for BNB Chain:
node clawlett/scripts/initialize.js --chain bnb --owner <YOUR_WALLET_ADDRESS>
```

2. Fund the agent address with ~0.001 native token for gas (address shown in output)

3. Run the script again - it will complete the setup automatically

4. Fund your Safe with tokens to trade

## Usage

### Check Balances

```bash
# ETH balance
node clawlett/scripts/balance.js

# Specific token
node clawlett/scripts/balance.js --token USDC

# All verified tokens
node clawlett/scripts/balance.js --all
```

### Swap Tokens

```bash
# KyberSwap (default — optimal routes across DEXs)
node clawlett/scripts/swap.js --from ETH --to USDC --amount 0.1
node clawlett/scripts/swap.js --from ETH --to USDC --amount 0.1 --execute

# CoW Protocol (MEV-protected)
node clawlett/scripts/cow.js --from USDC --to WETH --amount 100
node clawlett/scripts/cow.js --from USDC --to WETH --amount 100 --execute

# Swap by address (for tokens not in verified list)
node clawlett/scripts/swap.js --from USDC --to 0xa1832f7f4e534ae557f9b5ab76de54b1873e498b --amount 100 --execute
```

### Trenches Trading

Create tokens and trade on Trenches bonding curves:

```bash
# Create a new token
node clawlett/scripts/trenches.js create --name "My Token" --symbol MTK --description "A cool token"
node clawlett/scripts/trenches.js create --name "My Token" --symbol MTK --description "desc" --initial-buy 0.01

# Buy tokens with ETH
node clawlett/scripts/trenches.js buy --token MTK --amount 0.01

# Sell tokens for ETH
node clawlett/scripts/trenches.js sell --token MTK --amount 1000
node clawlett/scripts/trenches.js sell --token MTK --all

# Token info
node clawlett/scripts/trenches.js info MTK
```

### Token Discovery

Browse trending and top-performing tokens on Trenches:

```bash
node clawlett/scripts/trenches.js trending
node clawlett/scripts/trenches.js trending --window 1h --limit 5
node clawlett/scripts/trenches.js new
node clawlett/scripts/trenches.js top-volume
node clawlett/scripts/trenches.js gainers
node clawlett/scripts/trenches.js losers
```

### Custom RPC

All scripts support `--rpc` flag for custom RPC endpoints:

```bash
node clawlett/scripts/balance.js --rpc https://base.llamarpc.com
node clawlett/scripts/swap.js --from ETH --to USDC --amount 0.1 --rpc https://base.llamarpc.com
```

## Verified Tokens

Protected tokens can only resolve to verified addresses (scam protection):

| Token | Address |
|-------|---------|
| ETH | Native ETH (`0x0000000000000000000000000000000000000000`) |
| WETH | `0x4200000000000000000000000000000000000006` |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDT | `0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2` |
| DAI | `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb` |
| USDS | `0x820C137fa70C8691f0e44Dc420a5e53c168921Dc` |
| AERO | `0x940181a94A35A4569E4529A3CDfB74e38FD98631` |
| cbBTC | `0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf` |
| VIRTUAL | `0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b` |
| DEGEN | `0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed` |
| BRETT | `0x532f27101965dd16442E59d40670FaF5eBB142E4` |
| TOSHI | `0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4` |
| WELL | `0xA88594D404727625A9437C3f886C7643872296AE` |
| BID | `0xa1832f7f4e534ae557f9b5ab76de54b1873e498b` |

## Configuration

Config is stored per-chain in `config/<chain>/wallet.json` after initialization. The agent private key (`config/agent.pk`) is shared across all chains.

```json
{
  "chainId": 8453,
  "owner": "0x...",
  "agent": "0x...",
  "safe": "0x...",
  "roles": "0x...",
  "roleKey": "0x..."
}
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_RPC_URL` | `https://mainnet.base.org` | Base RPC endpoint |
| `WALLET_CONFIG_DIR` | `./config` | Config directory |
| `QUOTE_API_URL` | Production API | Quote/routing API |
| `TRENCHES_API_URL` | `https://trenches.bid` | Trenches API endpoint |

## Contracts

| Contract | Address | Description |
|----------|---------|-------------|
| Safe Singleton | `0x3E5c63644E683549055b9Be8653de26E0B4CD36E` | Safe L2 impl |
| CoW Settlement | `0x9008D19f58AAbD9eD0D60971565AA8510560ab41` | CoW Protocol settlement |
| CoW Vault Relayer | `0xC92E8bdf79f0507f65a392b0ab4667716BFE0110` | CoW token allowance target |
| KyberSwap Router | `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5` | KyberSwap Meta Aggregation Router V2 |
| ZodiacHelpers | `0x38441B5bd6370b000747c97a12877c83c0A32eaF` | Approvals, CoW presign, KyberSwap, WETH wrap/unwrap, Trenches factory wrappers via delegatecall |
| AgentKeyFactoryV3 | `0x2EA0010c18fa7239CAD047eb2596F8d8B7Cf2988` | Trenches token creation and trading |
| Safe Factory | `0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2` | Safe deployer |
| Roles Singleton | `0x9646fDAD06d3e24444381f44362a3B0eB343D337` | Zodiac Roles |
| Module Factory | `0x000000000000aDdB49795b0f9bA5BC298cDda236` | Module deployer |
| CNS | `0x299319e0BC8d67e11AD8b17D4d5002033874De3a` | Clawlett Name Service (unique agent names) |

## OpenClaw Integration

This skill is designed to work with [OpenClaw](https://openclaw.ai) agents. The agent can:

- Check wallet balances on request
- Get swap quotes via KyberSwap (default) or CoW Protocol
- Execute swaps after user confirmation
- Create tokens on Trenches
- Buy and sell Trenches tokens via factory
- Discover trending, new, and top-performing tokens
- Protect users from scam tokens

See [SKILL.md](./clawlett/SKILL.md) for the skill specification.

## Troubleshooting
Checkout [Troubleshooting Guide](TROUBLESHOOTING.md) for common issues. 

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT
