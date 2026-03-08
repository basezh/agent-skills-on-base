/**
 * Chain registry — resolves chain configs and manages per-chain config directories.
 */

import fs from 'fs'
import path from 'path'
import baseChain from './base.js'
import bnbChain from './bnb.js'

const chains = {
    base: baseChain,
    bnb: bnbChain,
}

export function getChain(name) {
    const chain = chains[name]
    if (!chain) {
        const available = Object.keys(chains).join(', ')
        throw new Error(`Unknown chain "${name}". Available chains: ${available}`)
    }
    return chain
}

export function listChains() {
    return Object.keys(chains)
}

export function getChainConfigDir(baseConfigDir, chainName) {
    return path.join(baseConfigDir, chainName)
}

/**
 * Migrate old flat config structure to per-chain directories.
 * If config/wallet.json exists and config/base/wallet.json does not,
 * moves wallet.json and init-state.json into config/base/.
 */
export function migrateConfigIfNeeded(baseConfigDir) {
    const oldWalletPath = path.join(baseConfigDir, 'wallet.json')
    const newBaseDir = path.join(baseConfigDir, 'base')
    const newWalletPath = path.join(newBaseDir, 'wallet.json')

    if (fs.existsSync(oldWalletPath) && !fs.existsSync(newWalletPath)) {
        console.log('\nMigrating config to per-chain directory structure...')
        fs.mkdirSync(newBaseDir, { recursive: true })

        fs.renameSync(oldWalletPath, newWalletPath)
        console.log(`  Moved wallet.json -> base/wallet.json`)

        const oldStatePath = path.join(baseConfigDir, 'init-state.json')
        if (fs.existsSync(oldStatePath)) {
            fs.renameSync(oldStatePath, path.join(newBaseDir, 'init-state.json'))
            console.log(`  Moved init-state.json -> base/init-state.json`)
        }

        console.log('  Migration complete.\n')
    }
}

export function loadConfig(configDir) {
    const configPath = path.join(configDir, 'wallet.json')
    if (!fs.existsSync(configPath)) {
        throw new Error(`Config not found: ${configPath}\nRun initialize.js first.`)
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf8'))
}

/**
 * Shared helper: resolve chain config, config directory, and load wallet config.
 * Automatically runs config migration on first use.
 */
export function loadChainAndConfig(args) {
    const chain = getChain(args.chain || 'base')
    migrateConfigIfNeeded(args.configDir)
    const configDir = getChainConfigDir(args.configDir, chain.id)
    const config = loadConfig(configDir)
    return { chain, configDir, config }
}
