#!/usr/bin/env node
/**
 * claw402 query script — uses the claw402 SDK for x402 V2 payment flow.
 * Usage: node query.mjs <path> [key=value ...]
 * Example: node query.mjs /api/v1/nofx/netflow/top-ranking limit=20 duration=1h
 */

import { Claw402 } from 'claw402'

const [,, path, ...paramArgs] = process.argv

if (!path) {
  console.error(JSON.stringify({ error: 'Usage: node query.mjs <path> [key=value ...]' }))
  process.exit(1)
}

const privateKey = process.env.WALLET_PRIVATE_KEY
if (!privateKey) {
  console.error(JSON.stringify({ error: 'WALLET_PRIVATE_KEY environment variable is required' }))
  process.exit(1)
}

const gateway = process.env.CLAW402_GATEWAY ?? 'https://claw402.ai'

// Parse key=value params
const params = {}
for (const arg of paramArgs) {
  const idx = arg.indexOf('=')
  if (idx > 0) params[arg.slice(0, idx)] = arg.slice(idx + 1)
}

const qs = new URLSearchParams(params).toString()
const url = `${gateway}${path}${qs ? '?' + qs : ''}`

try {
  const client = new Claw402({ privateKey, baseUrl: gateway })
  const data = await client._get(path, params)

  console.log(JSON.stringify({ status: 200, url, data }, null, 2))
} catch (err) {
  console.error(JSON.stringify({ error: String(err), url }))
  process.exit(1)
}
