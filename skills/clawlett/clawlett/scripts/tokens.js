/**
 * Shared token resolution module
 *
 * Provides verified token lists, symbol resolution, and DexScreener search
 * fallback for tokens not in the hardcoded list.
 *
 * All functions are parameterized by chain config.
 */

import { ethers } from 'ethers'

const NATIVE_ETH = '0x0000000000000000000000000000000000000000'

// ABIs
const ERC20_ABI = [
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address) view returns (uint256)',
    'function allowance(address, address) view returns (uint256)',
]

// ============================================================================
// TOKEN SEARCH - DexScreener fallback
// ============================================================================

async function searchToken(symbol, chain) {
    const dexChainId = chain.dexscreener?.chainId || 'base'
    const url = `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(symbol)}`
    const response = await fetch(url)
    if (!response.ok) return null

    const data = await response.json()
    if (!data.pairs || data.pairs.length === 0) return null

    const chainPairs = data.pairs.filter(p => p.chainId === dexChainId)
    if (chainPairs.length === 0) return null

    for (const pair of chainPairs) {
        const match = [pair.baseToken, pair.quoteToken].find(
            t => t.symbol.toUpperCase() === symbol.toUpperCase()
        )
        if (match) {
            return {
                id: match.address,
                symbol: match.symbol,
                name: match.name,
                volumeUSD: pair.volume?.h24,
                liquidity: pair.liquidity?.usd,
                dex: pair.dexId,
            }
        }
    }

    return null
}

// ============================================================================
// TOKEN RESOLUTION
// ============================================================================

async function resolveToken(token, provider, chain) {
    token = token.trim()

    const verifiedTokens = chain.verifiedTokens
    const tokenAliases = chain.tokenAliases || {}
    const protectedSymbols = chain.protectedSymbols || []

    if (token.startsWith('0x') && token.length === 42) {
        return resolveByAddress(token, provider, chain)
    }

    const symbol = token.toUpperCase().replace(/^\$/, '')
    const aliasedSymbol = tokenAliases[symbol] || symbol

    if (verifiedTokens[aliasedSymbol]) {
        const address = verifiedTokens[aliasedSymbol]

        // Native token doesn't have a contract
        if (address === NATIVE_ETH) {
            return { address, symbol: chain.nativeToken || aliasedSymbol, decimals: 18, verified: true }
        }

        const tokenContract = new ethers.Contract(address, ERC20_ABI, provider)
        const [onChainSymbol, decimals] = await Promise.all([
            tokenContract.symbol(),
            tokenContract.decimals(),
        ])
        return {
            address,
            symbol: onChainSymbol,
            decimals: Number(decimals),
            verified: true,
        }
    }

    if (protectedSymbols.includes(aliasedSymbol)) {
        throw new Error(
            `SECURITY: "${symbol}" is a protected token but no verified address found.\n` +
            `This could be a scam token. Use contract address directly if intended.`
        )
    }

    // Fallback: search DexScreener
    const searchResult = await searchToken(aliasedSymbol, chain)

    if (searchResult) {
        const address = ethers.getAddress(searchResult.id)
        const tokenContract = new ethers.Contract(address, ERC20_ABI, provider)
        const [onChainSymbol, decimals] = await Promise.all([
            tokenContract.symbol(),
            tokenContract.decimals(),
        ])

        const volumeStr = searchResult.volumeUSD
            ? `$${Number(searchResult.volumeUSD).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
            : 'unknown'
        const liqStr = searchResult.liquidity
            ? `$${Number(searchResult.liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
            : 'unknown'

        return {
            address,
            symbol: onChainSymbol,
            decimals: Number(decimals),
            verified: false,
            name: searchResult.name,
            volumeUSD: searchResult.volumeUSD,
            liquidity: searchResult.liquidity,
            dex: searchResult.dex,
            warning:
                `UNVERIFIED TOKEN: ${onChainSymbol} (${address}) found on DexScreener.\n` +
                ` 24h volume: ${volumeStr} | Liquidity: ${liqStr} | DEX: ${searchResult.dex}\n` +
                ` This token is NOT in the verified list. Verify the contract address before proceeding.`,
        }
    }

    throw new Error(
        `Token "${symbol}" not found in verified list or DexScreener (${chain.name}).\n` +
        `Use contract address directly: --from 0x...`
    )
}

async function resolveByAddress(address, provider, chain) {
    address = ethers.getAddress(address)

    const verifiedTokens = chain.verifiedTokens
    const protectedSymbols = chain.protectedSymbols || []

    const verifiedEntry = Object.entries(verifiedTokens).find(
        ([, addr]) => addr.toLowerCase() === address.toLowerCase()
    )

    const tokenContract = new ethers.Contract(address, ERC20_ABI, provider)
    const [symbol, decimals] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.decimals(),
    ])

    const result = {
        address,
        symbol,
        decimals: Number(decimals),
        verified: !!verifiedEntry,
    }

    if (!verifiedEntry && protectedSymbols.includes(symbol.toUpperCase())) {
        result.warning =
            `WARNING: Token has symbol "${symbol}" but is NOT the verified ${symbol}.\n` +
            `Verified address: ${verifiedTokens[symbol.toUpperCase()]}\n` +
            `You provided: ${address}\n` +
            `This could be a SCAM TOKEN.`
    }

    return result
}

export {
    ERC20_ABI,
    resolveToken,
    resolveByAddress,
    searchToken,
}
