#!/usr/bin/env node

/**
 * Trenches token creation and bonding curve trading (via Safe + Zodiac Roles)
 *
 * Creates tokens and trades on Trenches bonding curves on Base.
 * All on-chain operations go through ZodiacHelpers wrapper functions
 * which validate the factory address and forward calls with explicit ethValue
 * (since msg.value doesn't work in delegatecall).
 *
 * Subcommands:
 *   create      Create a new token on Trenches
 *   buy         Buy tokens with ETH
 *   sell        Sell tokens for ETH
 *   info        Get token information
 *   trending    Show trending tokens
 *   new         Show newly created tokens
 *   top-volume  Show top volume tokens
 *   gainers     Show top gainers
 *   losers      Show top losers
 *
 * Usage:
 *   node trenches.js create --name "Token" --symbol TKN --description "desc" [--initial-buy 0.01]
 *   node trenches.js buy --token TKN --amount 0.01 [--all]
 *   node trenches.js sell --token TKN --amount 1000 [--all]
 *   node trenches.js info TKN
 *   node trenches.js trending [--window 1h] [--limit 10]
 */

import { ethers } from 'ethers'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadChainAndConfig } from './chains/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================================================
// CONSTANTS
// ============================================================================

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// Uniswap V3 sqrt price limits
const MIN_SQRT_PRICE = 4295128739n
const MAX_SQRT_PRICE = 1461446703485210103287273052203988822378723970342n

// ZodiacHelpers ABIs (wrapper functions — NOT the raw factory ABIs)
const ZODIAC_HELPERS_ABI = [
    'function createViaFactory(address factory, (bytes signature, bytes data, uint256 expiresAt) signature, uint256 ethValue) external',
    'function tradeViaFactory(address factory, address inputToken, uint256 approvalAmount, (bytes signature, bytes data, uint256 expiresAt, uint256 nonce) signature, (uint160 sqrtPriceLimit, uint256 minAmountOut) tradeLimits, uint256 ethValue) external',
    'function approveForFactory(address factory, address token, uint256 amount) external',
]

// Read-only factory ABI (for mintCost)
const FACTORY_READ_ABI = [
    'function mintCost() external view returns (uint256)',
]

const ROLES_ABI = [
    'function execTransactionWithRole(address to, uint256 value, bytes data, uint8 operation, bytes32 roleKey, bool shouldRevert) returns (bool)',
]

const ERC20_ABI = [
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address) view returns (uint256)',
    'function allowance(address, address) view returns (uint256)',
]

// ============================================================================
// HELPERS
// ============================================================================

function apiHeaders(extra = {}) {
    return { ...extra }
}

function loadAgentAndRoles(config, baseConfigDir, rpcUrl, chainId) {
    const provider = new ethers.JsonRpcProvider(rpcUrl, chainId, { staticNetwork: true })

    const agentPkPath = path.join(baseConfigDir, 'agent.pk')
    if (!fs.existsSync(agentPkPath)) {
        throw new Error('Agent private key not found. Run initialize.js first.')
    }
    let privateKey = fs.readFileSync(agentPkPath, 'utf8').trim()
    if (!privateKey.startsWith('0x')) privateKey = '0x' + privateKey

    const wallet = new ethers.Wallet(privateKey, provider)
    const roles = new ethers.Contract(config.roles, ROLES_ABI, wallet)

    const zodiacHelpersAddress = config.contracts?.ZodiacHelpers
    if (!zodiacHelpersAddress) {
        throw new Error('ZodiacHelpers address not found in config. Re-run initialize.js.')
    }

    return { provider, wallet, roles, zodiacHelpersAddress }
}

function getSqrtPriceLimit(isBuy, tokenAddress, baseTokenAddress) {
    const zeroForOne = isBuy
        ? baseTokenAddress.toLowerCase() < tokenAddress.toLowerCase()
        : tokenAddress.toLowerCase() < baseTokenAddress.toLowerCase()
    return zeroForOne ? MIN_SQRT_PRICE + 1n : MAX_SQRT_PRICE - 1n
}

function formatAmount(amount, decimals, symbol) {
    const formatted = ethers.formatUnits(amount, decimals)
    const num = parseFloat(formatted)
    if (num < 0.01) return `${formatted} ${symbol}`
    return `${num.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${symbol}`
}

function formatEth(wei) {
    return formatAmount(wei, 18, 'ETH')
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

async function getAuthCookies(config, baseConfigDir, rpcUrl, chainId, trenchesApiUrl) {
    if (config.cookies) {
        return config.cookies
    }

    // Re-authenticate using agent wallet
    console.log('No stored cookies, authenticating...')
    const agentPkPath = path.join(baseConfigDir, 'agent.pk')
    let privateKey = fs.readFileSync(agentPkPath, 'utf8').trim()
    if (!privateKey.startsWith('0x')) privateKey = '0x' + privateKey

    const provider = new ethers.JsonRpcProvider(rpcUrl, chainId, { staticNetwork: true })
    const wallet = new ethers.Wallet(privateKey, provider)

    const challengeRes = await fetch(
        `${trenchesApiUrl}/api/auth/wallet?wallet=${wallet.address.toLowerCase()}`,
        { headers: apiHeaders() },
    )
    const challengeData = await challengeRes.json()
    if (!challengeRes.ok) {
        throw new Error(challengeData.error || 'Failed to get auth challenge')
    }

    const parts = challengeData.jwt.split('.')
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    const message = challengeData.message || payload.message

    const signature = await wallet.signMessage(message)
    const authRes = await fetch(`${trenchesApiUrl}/api/auth/wallet`, {
        method: 'POST',
        headers: apiHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
            wallet: wallet.address.toLowerCase(),
            signature,
            jwt: challengeData.jwt,
        }),
    })

    const authData = await authRes.json()
    if (!authRes.ok) {
        throw new Error(authData.error || 'Authentication failed')
    }

    const cookies = authRes.headers.getSetCookie?.() || []
    const cookieString = cookies.map(c => c.split(';')[0]).join('; ')
    if (!cookieString) {
        throw new Error('No session cookies received from authentication')
    }

    return cookieString
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

async function uploadImageApi(cookies, imagePath, trenchesApiUrl) {
    if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`)
    }

    const stat = fs.statSync(imagePath)
    if (stat.size > 4_000_000) {
        throw new Error(`Image too large (${(stat.size / 1_000_000).toFixed(1)}MB). Max 4MB.`)
    }

    const ext = path.extname(imagePath).toLowerCase()
    const mimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }
    const mimeType = mimeTypes[ext]
    if (!mimeType) {
        throw new Error(`Unsupported image type: ${ext}. Use PNG, JPEG, or WEBP.`)
    }

    const imageData = fs.readFileSync(imagePath)
    const blob = new Blob([imageData], { type: mimeType })
    const formData = new FormData()
    formData.append('image', blob, path.basename(imagePath))

    const response = await fetch(`${trenchesApiUrl}/api/skill/image`, {
        method: 'POST',
        headers: apiHeaders({ 'Cookie': cookies }),
        body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || data.message || `Image upload failed: ${JSON.stringify(data)}`)
    }

    return data.imageUrl
}

async function createTokenApi(cookies, params, trenchesApiUrl, chainId) {
    const response = await fetch(`${trenchesApiUrl}/api/skill/token/create`, {
        method: 'POST',
        headers: apiHeaders({
            'Content-Type': 'application/json',
            'Cookie': cookies,
        }),
        body: JSON.stringify({
            name: params.name,
            symbol: params.symbol,
            description: params.description,
            twitter: params.twitter || '',
            website: params.website || '',
            initialBuyAmount: params.initialBuyAmount || '0',
            chainId: chainId,
            baseToken: params.baseToken || ZERO_ADDRESS,
            isAntiSnipeEnabled: params.isAntiSnipeEnabled !== false,
            imageUrl: params.imageUrl || '',
        }),
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || data.message || `Token creation API failed: ${JSON.stringify(data)}`)
    }

    return data
}

async function getSwapSignature(cookies, tokenAddress, amountIn, isBuy, trenchesApiUrl, chainId) {
    const response = await fetch(`${trenchesApiUrl}/api/skill/swap`, {
        method: 'POST',
        headers: apiHeaders({
            'Content-Type': 'application/json',
            'Cookie': cookies,
        }),
        body: JSON.stringify({
            tokenAddress,
            amountIn: amountIn.toString(),
            isBuy,
            chainId: chainId,
        }),
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || data.message || `Swap API failed: ${JSON.stringify(data)}`)
    }

    return data
}

async function getTokenInfo(symbol, trenchesApiUrl, chainId) {
    const response = await fetch(
        `${trenchesApiUrl}/api/skill/token?symbol=${encodeURIComponent(symbol)}&chainId=${chainId}`,
        { headers: apiHeaders() },
    )

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || data.message || `Token info failed: ${JSON.stringify(data)}`)
    }

    return data
}

async function getDiscovery(endpoint, params = {}, trenchesApiUrl, chainId) {
    const query = new URLSearchParams({ chainId: String(chainId), ...params })
    const response = await fetch(
        `${trenchesApiUrl}/api/skill/tokens/${endpoint}?${query}`,
        { headers: apiHeaders() },
    )

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || data.message || `Discovery API failed: ${JSON.stringify(data)}`)
    }

    return data
}

// ============================================================================
// ARG PARSING
// ============================================================================

function parseArgs() {
    const args = process.argv.slice(2)
    const result = {
        subcommand: null,
        // create params
        name: null,
        symbol: null,
        description: null,
        twitter: null,
        website: null,
        initialBuy: null,
        baseToken: null,
        noAntibot: false,
        image: null,
        // buy/sell params
        token: null,
        amount: null,
        all: false,
        // discovery params
        window: null,
        limit: null,
        // common
        chain: 'base',
        configDir: process.env.WALLET_CONFIG_DIR || path.join(__dirname, '..', 'config'),
        rpc: null,
    }

    // First positional arg is subcommand
    if (args.length > 0 && !args[0].startsWith('-')) {
        result.subcommand = args[0]
    }

    for (let i = result.subcommand ? 1 : 0; i < args.length; i++) {
        switch (args[i]) {
            case '--name':
                result.name = args[++i]
                break
            case '--symbol':
                result.symbol = args[++i]
                break
            case '--description':
                result.description = args[++i]
                break
            case '--twitter':
                result.twitter = args[++i]
                break
            case '--website':
                result.website = args[++i]
                break
            case '--initial-buy':
                result.initialBuy = args[++i]
                break
            case '--base-token':
                result.baseToken = args[++i]
                break
            case '--no-antibot':
                result.noAntibot = true
                break
            case '--image':
                result.image = args[++i]
                break
            case '--token':
            case '-t':
                result.token = args[++i]
                break
            case '--amount':
            case '-a':
                result.amount = args[++i]
                break
            case '--all':
                result.all = true
                break
            case '--window':
            case '-w':
                result.window = args[++i]
                break
            case '--limit':
            case '-l':
                result.limit = args[++i]
                break
            case '--chain':
                result.chain = args[++i]
                break
            case '--config-dir':
            case '-c':
                result.configDir = args[++i]
                break
            case '--rpc':
            case '-r':
                result.rpc = args[++i]
                break
            case '--help':
            case '-h':
                printHelp(result.subcommand)
                process.exit(0)
                break
            default:
                // Positional arg after subcommand (e.g., "info TKN")
                if (!args[i].startsWith('-') && result.subcommand && !result.token) {
                    result.token = args[i]
                }
                break
        }
    }

    return result
}

function printHelp(subcommand) {
    if (!subcommand) {
        console.log(`
Usage: node trenches.js <subcommand> [options]

Trenches token creation and bonding curve trading on Base.

Subcommands:
  create      Create a new token on Trenches (0.005 ETH mint cost)
  buy         Buy tokens on bonding curve (with ETH or BID depending on pair)
  sell        Sell tokens on bonding curve (receive ETH or BID depending on pair)
  info        Get token information
  trending    Show trending tokens
  new         Show newly created tokens
  top-volume  Show top volume tokens
  gainers     Show top gainers
  losers      Show top losers

Common Options:
  --chain           Chain to use (default: base). Available: base, bnb
  --config-dir, -c  Config directory
  --rpc, -r         RPC URL (overrides chain default)
  --help, -h        Show help

Examples:
  node trenches.js create --name "My Token" --symbol MTK --description "A cool token"
  node trenches.js create --name "My Token" --symbol MTK --description "desc" --base-token ETH
  node trenches.js create --name "My Token" --symbol MTK --description "desc" --no-antibot --initial-buy 0.01
  node trenches.js buy --token MTK --amount 0.01
  node trenches.js buy --token CLAWLETT --all
  node trenches.js sell --token MTK --amount 1000
  node trenches.js sell --token MTK --all
  node trenches.js info MTK
  node trenches.js trending
  node trenches.js trending --window 1h --limit 5

Use "node trenches.js <subcommand> --help" for subcommand-specific help.
`)
        return
    }

    switch (subcommand) {
        case 'create':
            console.log(`
Usage: node trenches.js create --name <NAME> --symbol <SYMBOL> --description <DESC> [options]

Create a new token on Trenches bonding curve.

Mint cost: 0.005 ETH (paid to the factory contract on creation).
If --initial-buy is specified, the amount is in the base token (ETH or BID).
Mint cost (0.005 ETH) is always paid in ETH regardless of base token.
Note: --initial-buy cannot be used with anti-bot protection (enabled by default).

Arguments:
  --name            Token name (required)
  --symbol          Token symbol (required)
  --description     Token description (required)
  --twitter         Twitter handle
  --website         Website URL
  --initial-buy     Initial buy amount in base token (optional, e.g., 0.01)
  --base-token      Base token for bonding curve: BID (default) or ETH
  --no-antibot      Disable anti-bot/sniper protection (enabled by default)
  --image           Path to token image file (PNG/JPEG/WEBP, max 4MB)

Examples:
  node trenches.js create --name "My Token" --symbol MTK --description "A cool token"
  node trenches.js create --name "My Token" --symbol MTK --description "desc" --base-token ETH
  node trenches.js create --name "My Token" --symbol MTK --description "desc" --no-antibot --initial-buy 0.01
  node trenches.js create --name "My Token" --symbol MTK --description "desc" --image ./logo.png
`)
            break
        case 'buy':
            console.log(`
Usage: node trenches.js buy --token <SYMBOL> --amount <AMOUNT> [--all]

Buy tokens on the Trenches bonding curve. The amount is denominated in the
pair's base token (ETH for ETH-paired tokens, BID for BID-paired tokens).
The base token is detected automatically from the Trenches API.

Arguments:
  --token, -t       Token symbol or address (required)
  --amount, -a      Base token amount to spend (required unless --all)
  --all             Spend entire base token balance

Examples:
  node trenches.js buy --token MTK --amount 0.01
  node trenches.js buy --token CLAWLETT --amount 100
  node trenches.js buy --token CLAWLETT --all
`)
            break
        case 'sell':
            console.log(`
Usage: node trenches.js sell --token <SYMBOL> --amount <TOKEN_AMOUNT> [--all]

Sell tokens on the Trenches bonding curve. You receive the pair's base token
(ETH for ETH-paired tokens, BID for BID-paired tokens).

Arguments:
  --token, -t       Token symbol or address (required)
  --amount, -a      Token amount to sell (required unless --all)
  --all             Sell entire token balance

Examples:
  node trenches.js sell --token MTK --amount 1000
  node trenches.js sell --token MTK --all
`)
            break
        case 'info':
            console.log(`
Usage: node trenches.js info <SYMBOL>

Get token information from the Trenches API.

Arguments:
  First positional arg or --token: Token symbol (required)

Examples:
  node trenches.js info MTK
  node trenches.js info --token MTK
`)
            break
        default:
            console.log(`
Usage: node trenches.js ${subcommand} [--window <WINDOW>] [--limit <N>]

Show ${subcommand} tokens from Trenches.

Arguments:
  --window, -w      Time window (e.g., 1h, 24h) - trending only
  --limit, -l       Number of results (default: 10)

Examples:
  node trenches.js ${subcommand}
  node trenches.js ${subcommand} --limit 5
`)
            break
    }
}

// ============================================================================
// SUBCOMMAND HANDLERS
// ============================================================================

async function handleCreate(args, chain, configDir, config) {
    if (!args.name || !args.symbol || !args.description) {
        console.error('Error: --name, --symbol, and --description are required')
        printHelp('create')
        process.exit(1)
    }

    const trenchesConfig = chain.trenches
    const trenchesApiUrl = process.env.TRENCHES_API_URL || trenchesConfig.apiUrl
    const AGENT_KEY_FACTORY = trenchesConfig.factory
    const BID_ADDRESS = trenchesConfig.bidToken

    // Resolve base token
    let baseTokenAddress
    if (!args.baseToken || args.baseToken.toUpperCase() === 'BID') {
        baseTokenAddress = BID_ADDRESS
        console.log(`\nBase token: BID (${BID_ADDRESS})`)
    } else if (args.baseToken.toUpperCase() === 'ETH') {
        baseTokenAddress = ZERO_ADDRESS
        console.log(`\nBase token: ETH`)
    } else if (args.baseToken.startsWith('0x') && args.baseToken.length === 42) {
        baseTokenAddress = ethers.getAddress(args.baseToken)
        console.log(`\nBase token: ${baseTokenAddress}`)
    } else {
        console.error(`Error: Invalid --base-token. Use BID, ETH, or a token address.`)
        process.exit(1)
    }

    const rpcUrl = args.rpc || process.env.BASE_RPC_URL || chain.rpc
    const { provider, wallet, roles, zodiacHelpersAddress } = loadAgentAndRoles(config, args.configDir, rpcUrl, chain.chainId)
    const safeAddress = config.safe

    console.log(`Safe: ${safeAddress}`)
    console.log(`Creating token: ${args.name} (${args.symbol})`)
    const isAntiSnipeEnabled = !args.noAntibot
    console.log(`Anti-bot protection: ${isAntiSnipeEnabled ? 'ON' : 'OFF'}`)

    // Read mintCost from factory
    const factory = new ethers.Contract(AGENT_KEY_FACTORY, FACTORY_READ_ABI, provider)
    const mintCost = await factory.mintCost()
    console.log(`Mint cost: ${formatEth(mintCost)}`)

    const initialBuy = args.initialBuy ? ethers.parseEther(args.initialBuy) : 0n
    const isErc20Base = baseTokenAddress !== ZERO_ADDRESS

    // When base token is ERC20 (e.g. BID), initial buy is in that token, not ETH
    // ethValue only covers mint cost; the ERC20 is pulled via approval
    const totalEthValue = isErc20Base ? mintCost : mintCost + initialBuy

    // Check Safe ETH balance
    const ethBalance = await provider.getBalance(safeAddress)
    console.log(`Safe ETH balance: ${formatEth(ethBalance)}`)

    if (ethBalance < totalEthValue) {
        const detail = isErc20Base
            ? `Need ${formatEth(totalEthValue)} for mint cost`
            : `Need ${formatEth(totalEthValue)} (mint: ${formatEth(mintCost)} + initial buy: ${formatEth(initialBuy)})`
        console.error(`\nInsufficient ETH. ${detail}`)
        process.exit(1)
    }

    // Check ERC20 base token balance for initial buy
    if (isErc20Base && initialBuy > 0n) {
        const baseTokenContract = new ethers.Contract(baseTokenAddress, ERC20_ABI, provider)
        const baseSymbol = await baseTokenContract.symbol()
        const baseDecimals = Number(await baseTokenContract.decimals())
        const baseBalance = await baseTokenContract.balanceOf(safeAddress)
        console.log(`Safe ${baseSymbol} balance: ${formatAmount(baseBalance, baseDecimals, baseSymbol)}`)

        if (baseBalance < initialBuy) {
            console.error(`\nInsufficient ${baseSymbol}. Need ${formatAmount(initialBuy, baseDecimals, baseSymbol)} for initial buy, have ${formatAmount(baseBalance, baseDecimals, baseSymbol)}`)
            process.exit(1)
        }
    }

    // Get auth cookies
    const cookies = await getAuthCookies(config, args.configDir, rpcUrl, chain.chainId, trenchesApiUrl)

    // Upload image if provided
    let imageUrl = ''
    if (args.image) {
        console.log(`\nUploading image: ${args.image}`)
        const imagePath = path.resolve(args.image)
        imageUrl = await uploadImageApi(cookies, imagePath, trenchesApiUrl)
        console.log('   Image uploaded successfully!')
    }

    // Call create API
    console.log('\nRequesting token creation signature...')
    const apiResponse = await createTokenApi(cookies, {
        name: args.name,
        symbol: args.symbol,
        description: args.description,
        twitter: args.twitter,
        website: args.website,
        initialBuyAmount: args.initialBuy || '0',
        baseToken: baseTokenAddress,
        isAntiSnipeEnabled,
        imageUrl,
    }, trenchesApiUrl, chain.chainId)
    console.log('Signature received.')

    // Approve ERC20 base token for factory if needed (e.g. BID initial buy)
    const zodiacHelpers = new ethers.Interface(ZODIAC_HELPERS_ABI)

    if (isErc20Base && initialBuy > 0n) {
        console.log(`\nApproving ${formatEth(initialBuy)} of base token for factory...`)
        const approveData = zodiacHelpers.encodeFunctionData('approveForFactory', [
            AGENT_KEY_FACTORY,
            baseTokenAddress,
            initialBuy,
        ])

        const approveTx = await roles.execTransactionWithRole(
            zodiacHelpersAddress,
            0n,
            approveData,
            1, // delegatecall
            config.roleKey,
            true,
        )
        console.log(`   Transaction: ${approveTx.hash}`)
        const approveReceipt = await approveTx.wait()
        if (approveReceipt.status !== 1) {
            console.error('Approval transaction failed!')
            process.exit(1)
        }
        console.log('   Approved!')
    }

    // Encode ZodiacHelpers.createViaFactory call
    const encodedData = zodiacHelpers.encodeFunctionData('createViaFactory', [
        AGENT_KEY_FACTORY,
        {
            signature: apiResponse.signature,
            data: apiResponse.data,
            expiresAt: BigInt(apiResponse.expiresAt),
        },
        totalEthValue,
    ])

    // Execute via Roles (delegatecall, value=0n — ETH passed as explicit ethValue param)
    console.log('\nExecuting on-chain...')
    console.log(`   Total ETH: ${formatEth(totalEthValue)}`)
    if (initialBuy > 0n) {
        console.log(`   Initial buy: ${formatEth(initialBuy)}`)
    }

    const tx = await roles.execTransactionWithRole(
        zodiacHelpersAddress,
        0n,
        encodedData,
        1, // delegatecall
        config.roleKey,
        true,
    )
    console.log(`   Transaction: ${tx.hash}`)

    const receipt = await tx.wait()
    if (receipt.status !== 1) {
        console.error('Transaction failed!')
        process.exit(1)
    }

    // Try to parse TokenCreated event for token address
    let tokenAddress = null
    for (const log of receipt.logs) {
        try {
            if (log.topics[0] === ethers.id('TokenCreated(address,address,string,string)')) {
                tokenAddress = ethers.getAddress('0x' + log.topics[1].slice(26))
                break
            }
        } catch {}
    }

    console.log('\nTOKEN CREATED')
    if (tokenAddress) {
        console.log(`   Token: ${tokenAddress}`)
    }
    console.log(`   Name: ${args.name}`)
    console.log(`   Symbol: ${args.symbol}`)
    console.log(`   Tx: ${receipt.hash}`)
}

async function handleBuy(args, chain, configDir, config) {
    if (!args.token) {
        console.error('Error: --token is required')
        printHelp('buy')
        process.exit(1)
    }
    if (!args.amount && !args.all) {
        console.error('Error: --amount or --all is required')
        printHelp('buy')
        process.exit(1)
    }

    const trenchesConfig = chain.trenches
    const trenchesApiUrl = process.env.TRENCHES_API_URL || trenchesConfig.apiUrl
    const AGENT_KEY_FACTORY = trenchesConfig.factory
    const BID_ADDRESS = trenchesConfig.bidToken
    const WETH_ADDRESS = chain.wrappedNative

    const rpcUrl = args.rpc || process.env.BASE_RPC_URL || chain.rpc
    const { provider, wallet, roles, zodiacHelpersAddress } = loadAgentAndRoles(config, args.configDir, rpcUrl, chain.chainId)
    const safeAddress = config.safe

    // Resolve token and detect base token in one API call
    console.log(`\nResolving token: ${args.token}`)
    let tokenAddress, tokenSymbol, tokenDecimals
    let baseTokenAddress = WETH_ADDRESS
    let baseTokenSymbol = chain.nativeToken

    if (args.token.startsWith('0x') && args.token.length === 42) {
        tokenAddress = ethers.getAddress(args.token)
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
        tokenSymbol = await tokenContract.symbol()
        tokenDecimals = Number(await tokenContract.decimals())

        // Check anti-bot status and detect base token via API
        try {
            const tokenInfo = await getTokenInfo(tokenSymbol, trenchesApiUrl, chain.chainId)
            if (tokenInfo.isAntiBotActive) {
                console.error(`\nError: Anti-bot protection is active for ${tokenSymbol}.`)
                console.error('The agent cannot buy during the protection window. Try again later.')
                process.exit(1)
            }
            if (tokenInfo.baseToken && tokenInfo.baseToken.address &&
                tokenInfo.baseToken.address.toLowerCase() === BID_ADDRESS.toLowerCase()) {
                baseTokenAddress = BID_ADDRESS
                baseTokenSymbol = 'BID'
            }
        } catch {}
    } else {
        const tokenInfo = await getTokenInfo(args.token, trenchesApiUrl, chain.chainId)
        tokenAddress = ethers.getAddress(tokenInfo.address || tokenInfo.tokenAddress)
        tokenSymbol = tokenInfo.symbol || args.token
        tokenDecimals = tokenInfo.decimals || 18

        if (tokenInfo.isAntiBotActive) {
            console.error(`\nError: Anti-bot protection is active for ${tokenSymbol}.`)
            console.error('The agent cannot buy during the protection window. Try again later.')
            process.exit(1)
        }
        if (tokenInfo.baseToken && tokenInfo.baseToken.address &&
            tokenInfo.baseToken.address.toLowerCase() === BID_ADDRESS.toLowerCase()) {
            baseTokenAddress = BID_ADDRESS
            baseTokenSymbol = 'BID'
        }
    }

    console.log(`Token: ${tokenSymbol} (${tokenAddress})`)

    const isErc20Buy = baseTokenAddress !== WETH_ADDRESS

    // Determine buy amount
    let amountIn
    if (isErc20Buy) {
        // BID-paired: check BID balance
        const baseTokenContract = new ethers.Contract(baseTokenAddress, ERC20_ABI, provider)
        const baseBalance = await baseTokenContract.balanceOf(safeAddress)
        console.log(`Safe ${baseTokenSymbol} balance: ${formatAmount(baseBalance, 18, baseTokenSymbol)}`)

        if (args.all) {
            amountIn = baseBalance
            if (amountIn === 0n) {
                console.error(`\nNo ${baseTokenSymbol} to spend`)
                process.exit(1)
            }
            console.log(`Buying with all: ${formatAmount(amountIn, 18, baseTokenSymbol)}`)
        } else {
            amountIn = ethers.parseEther(args.amount)
            console.log(`Buy amount: ${formatAmount(amountIn, 18, baseTokenSymbol)}`)
            if (baseBalance < amountIn) {
                console.error(`\nInsufficient ${baseTokenSymbol}. Need ${formatAmount(amountIn, 18, baseTokenSymbol)}, have ${formatAmount(baseBalance, 18, baseTokenSymbol)}`)
                process.exit(1)
            }
        }
    } else {
        // ETH-paired: check ETH balance
        const ethBalance = await provider.getBalance(safeAddress)
        console.log(`Safe ETH balance: ${formatEth(ethBalance)}`)

        if (args.all) {
            amountIn = ethBalance
            if (amountIn === 0n) {
                console.error('\nNo ETH to spend')
                process.exit(1)
            }
            console.log(`Buying with all: ${formatEth(amountIn)}`)
        } else {
            amountIn = ethers.parseEther(args.amount)
            console.log(`Buy amount: ${formatEth(amountIn)}`)
            if (ethBalance < amountIn) {
                console.error(`\nInsufficient ETH. Need ${formatEth(amountIn)}, have ${formatEth(ethBalance)}`)
                process.exit(1)
            }
        }
    }

    // Get auth cookies
    const cookies = await getAuthCookies(config, args.configDir, rpcUrl, chain.chainId, trenchesApiUrl)

    // Get swap signature from API
    console.log('\nGetting swap signature...')
    const apiResponse = await getSwapSignature(cookies, tokenAddress, amountIn.toString(), true, trenchesApiUrl, chain.chainId)
    console.log('Signature received.')

    // Compute sqrtPriceLimit using actual base token
    const sqrtPriceLimit = getSqrtPriceLimit(true, tokenAddress, baseTokenAddress)

    const zodiacHelpers = new ethers.Interface(ZODIAC_HELPERS_ABI)

    // For ERC20-paired buys (e.g. BID), approve base token for factory
    if (isErc20Buy) {
        console.log(`\nApproving ${formatAmount(amountIn, 18, baseTokenSymbol)} for factory...`)
        const approveData = zodiacHelpers.encodeFunctionData('approveForFactory', [
            AGENT_KEY_FACTORY,
            baseTokenAddress,
            amountIn,
        ])
        const approveTx = await roles.execTransactionWithRole(
            zodiacHelpersAddress,
            0n,
            approveData,
            1, // delegatecall
            config.roleKey,
            true,
        )
        await approveTx.wait()
        console.log('   Approved.')
    }

    // Encode ZodiacHelpers.tradeViaFactory call
    const encodedData = zodiacHelpers.encodeFunctionData('tradeViaFactory', [
        AGENT_KEY_FACTORY,
        isErc20Buy ? baseTokenAddress : ZERO_ADDRESS,  // inputToken
        isErc20Buy ? amountIn : 0n,                    // approvalAmount
        {
            signature: apiResponse.signature,
            data: apiResponse.data,
            expiresAt: BigInt(apiResponse.expiresAt),
            nonce: BigInt(apiResponse.nonce),
        },
        {
            sqrtPriceLimit,
            minAmountOut: 0n,
        },
        isErc20Buy ? 0n : amountIn,  // ethValue (0 for ERC20 buys)
    ])

    // Execute via Roles (delegatecall)
    console.log('\nExecuting buy...')
    const tx = await roles.execTransactionWithRole(
        zodiacHelpersAddress,
        0n,
        encodedData,
        1, // delegatecall
        config.roleKey,
        true,
    )
    console.log(`   Transaction: ${tx.hash}`)

    const receipt = await tx.wait()
    if (receipt.status !== 1) {
        console.error('Transaction failed!')
        process.exit(1)
    }

    // Show new balance
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
    const newBalance = await tokenContract.balanceOf(safeAddress)

    console.log('\nBUY COMPLETE')
    console.log(`   Spent: ${formatAmount(amountIn, 18, baseTokenSymbol)}`)
    console.log(`   Token: ${tokenSymbol}`)
    console.log(`   New balance: ${formatAmount(newBalance, tokenDecimals, tokenSymbol)}`)
    console.log(`   Tx: ${receipt.hash}`)
}

async function handleSell(args, chain, configDir, config) {
    if (!args.token) {
        console.error('Error: --token is required')
        printHelp('sell')
        process.exit(1)
    }
    if (!args.amount && !args.all) {
        console.error('Error: --amount or --all is required')
        printHelp('sell')
        process.exit(1)
    }

    const trenchesConfig = chain.trenches
    const trenchesApiUrl = process.env.TRENCHES_API_URL || trenchesConfig.apiUrl
    const AGENT_KEY_FACTORY = trenchesConfig.factory
    const BID_ADDRESS = trenchesConfig.bidToken
    const WETH_ADDRESS = chain.wrappedNative

    const rpcUrl = args.rpc || process.env.BASE_RPC_URL || chain.rpc
    const { provider, wallet, roles, zodiacHelpersAddress } = loadAgentAndRoles(config, args.configDir, rpcUrl, chain.chainId)
    const safeAddress = config.safe

    // Resolve token and detect base token in one API call
    console.log(`\nResolving token: ${args.token}`)
    let tokenAddress, tokenSymbol, tokenDecimals
    let baseTokenAddress = WETH_ADDRESS
    let baseTokenSymbol = chain.nativeToken

    if (args.token.startsWith('0x') && args.token.length === 42) {
        tokenAddress = ethers.getAddress(args.token)
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
        tokenSymbol = await tokenContract.symbol()
        tokenDecimals = Number(await tokenContract.decimals())

        try {
            const tokenInfo = await getTokenInfo(tokenSymbol, trenchesApiUrl, chain.chainId)
            if (tokenInfo.baseToken && tokenInfo.baseToken.address &&
                tokenInfo.baseToken.address.toLowerCase() === BID_ADDRESS.toLowerCase()) {
                baseTokenAddress = BID_ADDRESS
                baseTokenSymbol = 'BID'
            }
        } catch {}
    } else {
        const tokenInfo = await getTokenInfo(args.token, trenchesApiUrl, chain.chainId)
        tokenAddress = ethers.getAddress(tokenInfo.address || tokenInfo.tokenAddress)
        tokenSymbol = tokenInfo.symbol || args.token
        tokenDecimals = tokenInfo.decimals || 18

        if (tokenInfo.baseToken && tokenInfo.baseToken.address &&
            tokenInfo.baseToken.address.toLowerCase() === BID_ADDRESS.toLowerCase()) {
            baseTokenAddress = BID_ADDRESS
            baseTokenSymbol = 'BID'
        }
    }

    console.log(`Token: ${tokenSymbol} (${tokenAddress})`)

    // Get token balance
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
    const tokenBalance = await tokenContract.balanceOf(safeAddress)
    console.log(`Safe ${tokenSymbol} balance: ${formatAmount(tokenBalance, tokenDecimals, tokenSymbol)}`)

    let amountIn
    if (args.all) {
        amountIn = tokenBalance
        if (amountIn === 0n) {
            console.error(`\nNo ${tokenSymbol} to sell`)
            process.exit(1)
        }
        console.log(`Selling all: ${formatAmount(amountIn, tokenDecimals, tokenSymbol)}`)
    } else {
        amountIn = ethers.parseUnits(args.amount, tokenDecimals)
        if (tokenBalance < amountIn) {
            console.error(`\nInsufficient ${tokenSymbol}. Need ${formatAmount(amountIn, tokenDecimals, tokenSymbol)}, have ${formatAmount(tokenBalance, tokenDecimals, tokenSymbol)}`)
            process.exit(1)
        }
        console.log(`Sell amount: ${formatAmount(amountIn, tokenDecimals, tokenSymbol)}`)
    }

    // Get auth cookies
    const cookies = await getAuthCookies(config, args.configDir, rpcUrl, chain.chainId, trenchesApiUrl)

    // Get swap signature from API
    console.log('\nGetting swap signature...')
    const apiResponse = await getSwapSignature(cookies, tokenAddress, amountIn.toString(), false, trenchesApiUrl, chain.chainId)
    console.log('Signature received.')

    // Compute sqrtPriceLimit using actual base token
    const sqrtPriceLimit = getSqrtPriceLimit(false, tokenAddress, baseTokenAddress)

    // Encode ZodiacHelpers.tradeViaFactory call
    // tradeViaFactory bundles approval + trade in a single call
    const zodiacHelpers = new ethers.Interface(ZODIAC_HELPERS_ABI)
    const encodedData = zodiacHelpers.encodeFunctionData('tradeViaFactory', [
        AGENT_KEY_FACTORY,
        tokenAddress,       // inputToken (selling this token)
        amountIn,           // approvalAmount (approve token for factory)
        {
            signature: apiResponse.signature,
            data: apiResponse.data,
            expiresAt: BigInt(apiResponse.expiresAt),
            nonce: BigInt(apiResponse.nonce),
        },
        {
            sqrtPriceLimit,
            minAmountOut: 0n,
        },
        0n,                 // ethValue (0 for sells)
    ])

    // Execute via Roles (delegatecall, value=0n)
    console.log('\nExecuting sell...')
    const tx = await roles.execTransactionWithRole(
        zodiacHelpersAddress,
        0n,
        encodedData,
        1, // delegatecall
        config.roleKey,
        true,
    )
    console.log(`   Transaction: ${tx.hash}`)

    const receipt = await tx.wait()
    if (receipt.status !== 1) {
        console.error('Transaction failed!')
        process.exit(1)
    }

    // Show updated balances
    const newTokenBalance = await tokenContract.balanceOf(safeAddress)

    console.log('\nSELL COMPLETE')
    console.log(`   Sold: ${formatAmount(amountIn, tokenDecimals, tokenSymbol)}`)
    console.log(`   Remaining ${tokenSymbol}: ${formatAmount(newTokenBalance, tokenDecimals, tokenSymbol)}`)

    if (baseTokenAddress === BID_ADDRESS) {
        const bidContract = new ethers.Contract(BID_ADDRESS, ERC20_ABI, provider)
        const newBidBalance = await bidContract.balanceOf(safeAddress)
        console.log(`   BID balance: ${formatAmount(newBidBalance, 18, 'BID')}`)
    } else {
        const newEthBalance = await provider.getBalance(safeAddress)
        console.log(`   ETH balance: ${formatEth(newEthBalance)}`)
    }
    console.log(`   Tx: ${receipt.hash}`)
}

async function handleInfo(args, chain) {
    const symbol = args.token
    if (!symbol) {
        console.error('Error: token symbol is required')
        console.error('Usage: node trenches.js info <SYMBOL>')
        process.exit(1)
    }

    const trenchesApiUrl = process.env.TRENCHES_API_URL || chain.trenches.apiUrl
    console.log(`\nFetching info for ${symbol}...\n`)
    const data = await getTokenInfo(symbol, trenchesApiUrl, chain.chainId)

    console.log('='.repeat(50))
    console.log(`  ${data.name || symbol} (${data.symbol || symbol})`)
    console.log('='.repeat(50))
    if (data.address || data.tokenAddress) console.log(`  Address:     ${data.address || data.tokenAddress}`)
    if (data.description) console.log(`  Description: ${data.description}`)
    if (data.price) console.log(`  Price:       $${data.price}`)
    if (data.marketCap) console.log(`  Market Cap:  $${Number(data.marketCap).toLocaleString()}`)
    if (data.volume24h) console.log(`  24h Volume:  $${Number(data.volume24h).toLocaleString()}`)
    if (data.liquidity) console.log(`  Liquidity:   $${Number(data.liquidity).toLocaleString()}`)
    if (data.holders) console.log(`  Holders:     ${data.holders}`)
    if (data.creator) console.log(`  Creator:     ${data.creator}`)
    console.log('='.repeat(50))
}

async function handleDiscovery(args, chain) {
    const endpointMap = {
        'trending': 'trending',
        'new': 'new',
        'top-volume': 'top-volume',
        'gainers': 'top-gainers',
        'losers': 'top-losers',
    }

    const endpoint = endpointMap[args.subcommand]
    if (!endpoint) {
        console.error(`Unknown discovery subcommand: ${args.subcommand}`)
        process.exit(1)
    }

    const trenchesApiUrl = process.env.TRENCHES_API_URL || chain.trenches.apiUrl
    const params = {}
    if (args.window) params.window = args.window
    if (args.limit) params.limit = args.limit

    const title = args.subcommand.charAt(0).toUpperCase() + args.subcommand.slice(1).replace('-', ' ')
    console.log(`\nFetching ${title.toLowerCase()} tokens...\n`)

    const data = await getDiscovery(endpoint, params, trenchesApiUrl, chain.chainId)
    const tokens = Array.isArray(data) ? data : data.tokens || data.data || []

    if (tokens.length === 0) {
        console.log('No tokens found.')
        return
    }

    console.log(`${'#'.padEnd(4)} ${'Symbol'.padEnd(10)} ${'Name'.padEnd(20)} ${'Price'.padEnd(14)} ${'Change'.padEnd(10)}`)
    console.log('-'.repeat(62))

    tokens.forEach((token, i) => {
        const num = String(i + 1).padEnd(4)
        const sym = (token.symbol || '???').padEnd(10)
        const name = (token.name || '').slice(0, 18).padEnd(20)
        const price = token.price ? `$${Number(token.price).toFixed(6)}`.padEnd(14) : 'N/A'.padEnd(14)
        const change = token.priceChange != null
            ? `${token.priceChange >= 0 ? '+' : ''}${Number(token.priceChange).toFixed(1)}%`
            : ''
        console.log(`${num} ${sym} ${name} ${price} ${change}`)
    })

    console.log(`\n${tokens.length} tokens shown.`)
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    const args = parseArgs()

    if (!args.subcommand) {
        printHelp()
        process.exit(0)
    }

    let chain, configDir, config
    try {
        const result = loadChainAndConfig(args)
        chain = result.chain
        configDir = result.configDir
        config = result.config
    } catch (error) {
        // For info/discovery subcommands, config may not be needed
        // but we still need the chain for API URLs
        const { getChain } = await import('./chains/index.js')
        chain = getChain(args.chain || 'base')
    }

    if (!chain.trenches) {
        console.error(`Error: Trenches is not available on ${chain.name}`)
        process.exit(1)
    }

    console.log(`Chain: ${chain.name}`)

    switch (args.subcommand) {
        case 'create':
            await handleCreate(args, chain, configDir, config)
            break
        case 'buy':
            await handleBuy(args, chain, configDir, config)
            break
        case 'sell':
            await handleSell(args, chain, configDir, config)
            break
        case 'info':
            await handleInfo(args, chain)
            break
        case 'trending':
        case 'new':
        case 'top-volume':
        case 'gainers':
        case 'losers':
            await handleDiscovery(args, chain)
            break
        default:
            console.error(`Unknown subcommand: ${args.subcommand}`)
            printHelp()
            process.exit(1)
    }
}

main().catch(error => {
    console.error(`\nError: ${error.message}`)
    process.exit(1)
})
