# Clawlett

Secure token swaps and Trenches trading, powered by Safe + Zodiac Roles.

**Supported chains:**
- **Base** (Chain ID: 8453) — default. KyberSwap, CoW Protocol, Trenches, CNS.
- **BNB Chain** (Chain ID: 56) — KyberSwap swaps + balance checking only.

Swap engines:
- **KyberSwap** (DEX aggregator for optimal routes) — default, available on all chains
- **CoW Protocol** (MEV-protected batch auctions) — Base only

Token creation & trading: **Trenches** (via AgentKeyFactoryV3) — Base only.

## Overview

This skill enables autonomous token swaps and Trenches token creation/trading through a Gnosis Safe. The agent operates through Zodiac Roles which restricts operations to:
- Swapping tokens via KyberSwap Aggregator (default) or CoW Protocol
- Creating tokens on Trenches (Base only)
- Buying and selling Trenches tokens via factory (Base only)
- Approving tokens for KyberSwap Router and CoW Vault Relayer
- Executing swaps via ZodiacHelpers delegatecall
- Wrapping ETH to WETH and unwrapping WETH to ETH via ZodiacHelpers
- Sending swapped tokens only back to the Safe (no draining)

All scripts accept `--chain <name>` (default: `base`). The same `agent.pk` is shared across chains; each chain gets its own Safe and config directory (`config/<chain>/`).

## Execution Policy

**CRITICAL: The agent MUST NEVER execute an on-chain transaction unless the user explicitly asks for it.** The default behavior for any swap, token creation, or trade request is **quote/preview only**. The agent should show the details and wait for the user to explicitly confirm execution (e.g., "execute", "do it", "go ahead", "yes, swap").

- "Swap 0.1 ETH for USDC" → get a quote and display it, do NOT execute
- "Swap 0.1 ETH for USDC and execute" → get a quote, display it, then execute
- Showing a quote and asking "should I execute?" is fine, but the agent must wait for an affirmative response before executing

This applies to all on-chain operations: swaps, token creation, buys, sells, wrapping/unwrapping.

## Capabilities

| Action | Autonomous | Chains | Notes |
|--------|------------|--------|-------|
| Check balances | ✅ | All | Native token and any ERC20 |
| Get swap quote (Kyber) | ✅ | All | Via KyberSwap Aggregator (best routes) |
| Get swap quote (CoW) | ✅ | Base | Via CoW Protocol (MEV-protected) |
| Swap tokens (Kyber) | ⚠️ | All | Requires explicit user confirmation |
| Swap tokens (CoW) | ⚠️ | Base | Requires explicit user confirmation |
| Wrap/Unwrap ETH | ⚠️ | All | Requires explicit user confirmation |
| Approve tokens | ⚠️ | All | Only for CoW Vault Relayer and KyberSwap Router; requires explicit user confirmation |
| Create token (Trenches) | ⚠️ | Base | Requires explicit user confirmation |
| Buy tokens (Trenches) | ⚠️ | Base | Requires explicit user confirmation |
| Sell tokens (Trenches) | ⚠️ | Base | Requires explicit user confirmation |
| Token info | ✅ | Base | Fetch token details from Trenches API |
| Token discovery | ✅ | Base | Trending, new, top volume, gainers, losers |
| Transfer funds | ❌ | - | Blocked by Roles |

## Agent Name (CNS)

Each agent can optionally register a **unique name** via the Clawlett Name Service (CNS). This name is the agent's app-wide identifier — no two agents can share the same name. The name is minted as an NFT on Base.

Pass `--name` during initialization to register a CNS name. If omitted, CNS registration is skipped. Once registered, it cannot be changed.

## Token Safety

### Verified Tokens

Protected tokens can ONLY resolve to verified addresses per chain.

**Base Mainnet:**

| Token | Verified Address |
|-------|--------------------|
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

**BNB Chain:**

| Token | Verified Address |
|-------|--------------------|
| BNB | Native BNB (`0x0000000000000000000000000000000000000000`) |
| WBNB | `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c` |
| USDC | `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d` |
| USDT | `0x55d398326f99059fF775485246999027B3197955` |
| BUSD | `0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56` |
| CAKE | `0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82` |
| ETH | `0x2170Ed0880ac9A755fd29B2688956BD959F933F8` |
| BTCB | `0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c` |

If a scam token impersonates these symbols, the agent will detect and warn.

### Unverified Token Search

Tokens not in the verified list are searched via DexScreener (Base pairs). Search results include:
- Contract address (on-chain verified)
- 24h trading volume and liquidity
- DEX where the token trades

**Agent behavior for unverified tokens:**
- Always display the warning with contract address, volume, and liquidity
- Ask the user to confirm before proceeding with the swap
- Never silently swap an unverified token

## Setup

1. Owner provides their wallet address (and optionally an **agent name** and **chain**)
2. Agent generates keypair → **Owner sends gas** to agent (at least 0.0001 native token on the target chain; 0.001 recommended)
3. Agent deploys Safe on the target chain (agent as initial owner)
4. Agent deploys Zodiac Roles module
5. Agent configures Roles permissions via MultiSend (enable module, scope targets, assign roles)
6. Agent registers with backend API
7. Agent optionally mints CNS name on-chain (if `--name` provided)
8. Agent transfers Safe ownership to human owner and removes itself as owner (keeps Roles access)
9. Agent registers on ERC-8004 Identity Registry and transfers identity NFT to Safe
10. **Owner funds Safe on Base Mainnet** with tokens to trade

## Usage

### Initialize
```
Initialize my wallet with owner 0x123...
Initialize my wallet with owner 0x123... and name MYAGENT
Initialize my wallet on BNB Chain with owner 0x123...
```

### Check Balance
```
What's my balance?
How much USDC do I have?
```

### Swap Tokens
```
Swap 0.1 ETH for USDC
Swap 100 USDC for ETH
Exchange 50 DAI to AERO
```

Two swap engines are available:

**KyberSwap Aggregator** (default):
- Finds optimal routes across multiple DEXs
- Native ETH supported directly (no wrapping needed)
- Best for finding the best price across fragmented liquidity
- 0.1% partner fee

**CoW Protocol**:
- MEV-protected batch auctions
- ETH is automatically wrapped to WETH (CoW requires ERC20s)
- Best for larger swaps where MEV protection matters
- 0.5% partner fee

To use CoW Protocol explicitly:
```
Swap 0.1 ETH for USDC using CoW
Use cow to swap 100 USDC for ETH
```

### Wrap/Unwrap ETH
```
Wrap 0.5 ETH to WETH
Unwrap 0.5 WETH to ETH
```

Wrapping and unwrapping is done via ZodiacHelpers delegatecall. When swapping from ETH via CoW, wrapping is handled automatically as part of the swap transaction.

### Trenches Trading

Trenches enables token creation and trading on Base. Tokens are created and traded via the AgentKeyFactoryV3 contract.

All on-chain operations go through ZodiacHelpers wrapper functions (`createViaFactory`, `tradeViaFactory`) which validate the factory address and forward calls with explicit `ethValue` (since `msg.value` doesn't work in delegatecall).

```
Create a token called "My Token" with symbol MTK
Create a token paired with BID (default base token)
Create a token with anti-bot disabled and an initial buy
Buy 0.01 ETH worth of MTK on Trenches
Buy 100 BID worth of CLAWLETT on Trenches
Buy all my BID into CLAWLETT
Sell all my MTK tokens
What's trending on Trenches?
Show me the top gainers
Get info on MTK token
```

**IMPORTANT — Token creation parameter collection:**
When a user asks to create a token, the agent MUST collect ALL of the following parameters before executing. If the user's request is missing any of these, ask them to provide the missing values. Do NOT use defaults silently — always confirm each parameter with the user.

| Parameter | Required | Description |
|-----------|----------|-------------|
| Name | **Yes** | The token name (e.g., "My Token") |
| Symbol | **Yes** | The token ticker symbol (e.g., MTK) |
| Description | **Yes** | A description of the token |
| Image | **Yes** | Path to a token image file (PNG/JPEG/WEBP, max 4MB) |
| Base token | No | `BID` (default) or `ETH` — which token to pair with |
| Anti-bot protection | No | ON by default (10-minute sniper protection). Ask user if they want it enabled or disabled |
| Initial buy | No | Amount of base token (ETH or BID, depending on pair) to buy immediately after creation (only works with anti-bot OFF) |
| Twitter | No | Twitter/X handle for the token |
| Website | No | Website URL for the token |
| Team allocation | No | SSL team positions that the team can claim after the price moves beyond a given position |

The agent should present the user with a summary of all parameters (including defaults) and ask for confirmation before executing the creation.

**Token creation defaults:**
- Base token: BID (use `--base-token ETH` for ETH pairing)
- Anti-bot protection: ON (10-minute sniper protection window)
- Initial buy is blocked when anti-bot is enabled (agent can't buy during protection window)
- Use `--no-antibot` to disable protection and allow initial buy
- Use `--image` to attach a custom token image (PNG/JPEG/WEBP, max 4MB)

**Image upload flow:**
- Images are uploaded to `/api/skill/image` before token creation
- The returned `imageUrl` is passed to the token creation API
- If image upload fails, the token creation will fail (image is required)

**Anti-bot protection and buying:**
- The agent cannot buy any token that has anti-bot protection currently active (within the 10-minute window after creation)
- This applies to all tokens, not just ones the agent created
- Both the client and backend enforce this — the backend will refuse to issue a swap signature for protected tokens
- Wait for the protection window to expire before buying

Token creation flow:
1. Upload token image via `/api/skill/image` (returns `imageUrl`)
2. Get creation signature from `/api/skill/token/create` (includes `imageUrl`)
3. **Display token details — do NOT execute yet**
4. **STOP and wait for the user to explicitly confirm** — do not proceed without confirmation
5. Only after user confirms: execute via Safe + Roles (ZodiacHelpers delegatecall)
6. **After creation, share the token page URL:** `https://trenches.bid/tokens/[address]`

Swap flow:
1. Resolve token symbols (with scam protection)
2. Get quote from KyberSwap (default) or CoW Protocol
3. **Display swap details (quote only — do NOT execute yet):**
   - Token symbols (e.g., ETH → USDC)
   - Token addresses (verified Base Mainnet contracts)
   - Input amount (what you're selling)
   - Output amount (estimated amount you'll receive)
   - Fee breakdown
4. **STOP and wait for the user to explicitly ask to execute** — do not proceed without confirmation
5. Only after user confirms: execute via Safe + Roles

## Scripts

| Script | Description | Chains |
|--------|-------------|--------|
| `initialize.js` | Deploy Safe + Roles, register CNS name | All |
| `swap.js` | Swap tokens via KyberSwap Aggregator (default, optimal routes) | All |
| `cow.js` | Swap tokens via CoW Protocol (MEV-protected) | Base |
| `balance.js` | Check native token and ERC20 balances | All |
| `trenches.js` | Create and trade Trenches tokens via factory | Base |

All scripts accept `--chain <name>` (default: `base`).

### Examples

```bash
# Initialize (name is optional, registers on CNS if provided)
node scripts/initialize.js --owner 0x123...
node scripts/initialize.js --owner 0x123... --name MYAGENT
node scripts/initialize.js --chain bnb --owner 0x123...

# Check balance
node scripts/balance.js
node scripts/balance.js --token USDC
node scripts/balance.js --chain bnb --all

# Swap tokens (KyberSwap Aggregator, default - optimal routes)
node scripts/swap.js --from ETH --to USDC --amount 0.1
node scripts/swap.js --from USDC --to ETH --amount 100 --execute
node scripts/swap.js --from DAI --to AERO --amount 50 --execute --slippage 1
node scripts/swap.js --chain bnb --from BNB --to USDC --amount 0.1

# Swap tokens (CoW Protocol, MEV-protected, Base only)
node scripts/cow.js --from ETH --to USDC --amount 0.1
node scripts/cow.js --from USDC --to WETH --amount 100 --execute
node scripts/cow.js --from USDC --to DAI --amount 50 --execute --timeout 600

# With custom slippage (0-0.5 range, e.g., 0.05 = 5%)
node scripts/cow.js --from ETH --to USDC --amount 0.1 --slippage 0.03 --execute

# Trenches: Create a token (BID base token by default, anti-bot ON)
node scripts/trenches.js create --name "My Token" --symbol MTK --description "A cool token"
node scripts/trenches.js create --name "My Token" --symbol MTK --description "desc" --base-token ETH
node scripts/trenches.js create --name "My Token" --symbol MTK --description "desc" --no-antibot --initial-buy 0.01
node scripts/trenches.js create --name "My Token" --symbol MTK --description "desc" --image ./logo.png

# Trenches: Buy/sell tokens (amount is in base token: ETH or BID depending on pair)
node scripts/trenches.js buy --token MTK --amount 0.01
node scripts/trenches.js buy --token CLAWLETT --all
node scripts/trenches.js sell --token MTK --amount 1000
node scripts/trenches.js sell --token MTK --all

# Trenches: Token info and discovery
node scripts/trenches.js info MTK
node scripts/trenches.js trending
node scripts/trenches.js trending --window 1h --limit 5
node scripts/trenches.js new
node scripts/trenches.js top-volume
node scripts/trenches.js gainers
node scripts/trenches.js losers
```

## Configuration

Config is stored per-chain in `config/<chain>/wallet.json`. The agent private key (`config/agent.pk`) is shared across all chains.

```
config/
  agent.pk              # shared across all chains
  base/
    wallet.json         # Base Safe, Roles, etc.
  bnb/
    wallet.json         # BNB Safe, Roles, etc.
```

Existing users with `config/wallet.json` (old flat structure) will be auto-migrated to `config/base/wallet.json` on first run.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_RPC_URL` | Chain default | RPC endpoint (overrides chain config) |
| `WALLET_CONFIG_DIR` | `config` | Base config directory |
| `TRENCHES_API_URL` | `https://trenches.bid` | Trenches API endpoint |

## Contracts (Base Mainnet)

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

## Updating

When the user says **"update to latest"**, follow this procedure:

1. `git fetch --tags origin` in the clawlett repo
2. Read current version from `scripts/package.json`
3. Identify the latest git tag (e.g., `git tag -l --sort=-v:refname | head -1`)
4. Read **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** for the migration path between current and latest version
5. Show the user: current version, new version, summary of changes, and whether on-chain steps are required
6. **ASK the user: "Do you want to proceed with this update?"** — do NOT proceed without explicit confirmation
7. If confirmed: `git checkout <tag>`, then walk through each migration step with the user

Some updates are code-only (just checkout the new tag). Others require on-chain transactions signed by the Safe owner (e.g., updating Roles permissions for a new ZodiacHelpers contract). The migration guide specifies which.

## Security Model

1. **Safe holds all funds** - Agent wallet only has gas
2. **Zodiac Roles restricts operations**:
   - Can only interact with ZodiacHelpers
   - ZodiacHelpers scoped with `allowTarget` (Send + DelegateCall)
   - Can only approve tokens for CoW Vault Relayer and KyberSwap Router
3. **No transfer/withdraw** - Agent cannot move funds out
4. **Scam protection** - Common tokens resolve to verified addresses only
5. **MEV protection** - CoW Protocol batches orders, preventing sandwich attacks and other MEV extraction
