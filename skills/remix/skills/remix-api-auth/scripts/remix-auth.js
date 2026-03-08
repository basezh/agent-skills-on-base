#!/usr/bin/env node

const command = process.argv[2] || 'status'

if (command !== 'status') {
  console.log('Usage: node skills/scripts/remix-auth.js status')
  process.exit(1)
}

const key = process.env.REMIX_API_KEY
if (!key) {
  console.log('No REMIX_API_KEY found')
  process.exit(1)
}

console.log(`REMIX_API_KEY detected (length=${key.length})`)
