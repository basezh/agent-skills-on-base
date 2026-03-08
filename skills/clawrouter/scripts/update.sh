#!/bin/bash
set -e

# ─────────────────────────────────────────────────────────────
#  ClawRouter Update Script
#  Safe update: backs up wallet key BEFORE touching anything,
#  restores it if the update process somehow wiped it.
# ─────────────────────────────────────────────────────────────

WALLET_FILE="$HOME/.openclaw/blockrun/wallet.key"
WALLET_BACKUP=""

# ── Step 1: Back up wallet key ─────────────────────────────────
echo "🦞 ClawRouter Update"
echo ""
echo "→ Checking wallet..."

if [ -f "$WALLET_FILE" ]; then
  # Validate the key looks correct before backing up
  WALLET_KEY=$(cat "$WALLET_FILE" | tr -d '[:space:]')
  KEY_LEN=${#WALLET_KEY}

  if [[ "$WALLET_KEY" == 0x* ]] && [ "$KEY_LEN" -eq 66 ]; then
    # Derive wallet address via node (viem is available post-install)
    WALLET_ADDRESS=$(node -e "
      try {
        const { privateKeyToAccount } = require('$HOME/.openclaw/extensions/clawrouter/node_modules/viem/accounts/index.js');
        const acct = privateKeyToAccount('$WALLET_KEY');
        console.log(acct.address);
      } catch {
        // viem not available yet (fresh install path), skip address check
        console.log('(address check skipped)');
      }
    " 2>/dev/null || echo "(address check skipped)")

    WALLET_BACKUP="$HOME/.openclaw/blockrun/wallet.key.bak.$(date +%s)"
    cp "$WALLET_FILE" "$WALLET_BACKUP"
    chmod 600 "$WALLET_BACKUP"

    echo "  ✓ Wallet backed up to: $WALLET_BACKUP"
    echo "  ✓ Wallet address: $WALLET_ADDRESS"
  else
    echo "  ⚠ Wallet file exists but has invalid format (len=$KEY_LEN)"
    echo "  ⚠ Skipping backup — you should restore your wallet manually"
  fi
else
  echo "  ℹ No existing wallet found (first install or already lost)"
fi

echo ""

# ── Step 2: Kill old proxy ──────────────────────────────────────
echo "→ Stopping old proxy..."
kill_port_processes() {
  local port="$1"
  local pids=""
  if command -v lsof >/dev/null 2>&1; then
    pids="$(lsof -ti :"$port" 2>/dev/null || true)"
  elif command -v fuser >/dev/null 2>&1; then
    pids="$(fuser "$port"/tcp 2>/dev/null || true)"
  fi
  if [ -n "$pids" ]; then
    echo "$pids" | xargs kill -9 2>/dev/null || true
  fi
}
kill_port_processes 8402

# ── Step 3: Remove old plugin files ────────────────────────────
echo "→ Removing old plugin files..."
rm -rf ~/.openclaw/extensions/clawrouter

# ── Step 3b: Clean stale plugin entry from config ─────────────
# After deleting plugin files, openclaw's config validator rejects
# the orphaned plugins.entries.clawrouter reference. Remove it so
# the fresh install in Step 4 can proceed.
echo "→ Cleaning config..."
node -e "
const fs = require('fs');
const path = require('path');
const configPath = path.join(require('os').homedir(), '.openclaw', 'openclaw.json');
if (!fs.existsSync(configPath)) process.exit(0);
try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const entries = config?.plugins?.entries;
  if (entries && entries.clawrouter) {
    delete entries.clawrouter;
    const tmp = configPath + '.tmp.' + process.pid;
    fs.writeFileSync(tmp, JSON.stringify(config, null, 2));
    fs.renameSync(tmp, configPath);
    console.log('  Removed stale plugin entry');
  } else {
    console.log('  Config clean');
  }
} catch (err) {
  console.log('  Skipped: ' + err.message);
}
"

# ── Step 4: Install latest version ─────────────────────────────
echo "→ Installing latest ClawRouter..."
openclaw plugins install @blockrun/clawrouter

# ── Step 5: Verify wallet survived ─────────────────────────────
echo ""
echo "→ Verifying wallet integrity..."

if [ -f "$WALLET_FILE" ]; then
  CURRENT_KEY=$(cat "$WALLET_FILE" | tr -d '[:space:]')
  CURRENT_LEN=${#CURRENT_KEY}

  if [[ "$CURRENT_KEY" == 0x* ]] && [ "$CURRENT_LEN" -eq 66 ]; then
    echo "  ✓ Wallet key intact at $WALLET_FILE"
  else
    echo "  ✗ Wallet file corrupted after update!"
    if [ -n "$WALLET_BACKUP" ] && [ -f "$WALLET_BACKUP" ]; then
      cp "$WALLET_BACKUP" "$WALLET_FILE"
      chmod 600 "$WALLET_FILE"
      echo "  ✓ Restored from backup: $WALLET_BACKUP"
    else
      echo "  ✗ No backup available — wallet key is lost"
      echo "     Restore manually: set BLOCKRUN_WALLET_KEY env var"
    fi
  fi
else
  echo "  ✗ Wallet file missing after update!"
  if [ -n "$WALLET_BACKUP" ] && [ -f "$WALLET_BACKUP" ]; then
    mkdir -p "$(dirname "$WALLET_FILE")"
    cp "$WALLET_BACKUP" "$WALLET_FILE"
    chmod 600 "$WALLET_FILE"
    echo "  ✓ Restored from backup: $WALLET_BACKUP"
  else
    echo "  ℹ New wallet will be generated on next gateway start"
  fi
fi

# ── Step 6: Inject auth profile ─────────────────────────────────
echo "→ Refreshing auth profile..."
node -e "
const os = require('os');
const fs = require('fs');
const path = require('path');
const authDir = path.join(os.homedir(), '.openclaw', 'agents', 'main', 'agent');
const authPath = path.join(authDir, 'auth-profiles.json');

fs.mkdirSync(authDir, { recursive: true });

let store = { version: 1, profiles: {} };
if (fs.existsSync(authPath)) {
  try {
    const existing = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    if (existing.version && existing.profiles) store = existing;
  } catch {}
}

const profileKey = 'blockrun:default';
if (!store.profiles[profileKey]) {
  store.profiles[profileKey] = { type: 'api_key', provider: 'blockrun', key: 'x402-proxy-handles-auth' };
  fs.writeFileSync(authPath, JSON.stringify(store, null, 2));
  console.log('  Auth profile created');
} else {
  console.log('  Auth profile already exists');
}
"

# ── Step 7: Clean models cache ──────────────────────────────────
echo "→ Cleaning models cache..."
rm -f ~/.openclaw/agents/*/agent/models.json 2>/dev/null || true

# ── Step 8: Populate model allowlist with top 16 models ────────
echo "→ Populating model allowlist..."
node -e "
const os = require('os');
const fs = require('fs');
const path = require('path');
const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');

if (!fs.existsSync(configPath)) {
  console.log('  No config file found, skipping');
  process.exit(0);
}

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // Top 16 models for the /model picker
  const TOP_MODELS = [
    'auto', 'free', 'eco', 'premium',
    'anthropic/claude-sonnet-4.6', 'anthropic/claude-opus-4.6', 'anthropic/claude-haiku-4.5',
    'openai/gpt-5.4', 'openai/gpt-4o', 'openai/o3',
    'google/gemini-3.1-pro', 'google/gemini-3-flash-preview',
    'deepseek/deepseek-chat', 'moonshot/kimi-k2.5',
    'xai/grok-3', 'minimax/minimax-m2.5'
  ];

  if (!config.agents) config.agents = {};
  if (!config.agents.defaults) config.agents.defaults = {};
  if (!config.agents.defaults.models || typeof config.agents.defaults.models !== 'object') {
    config.agents.defaults.models = {};
  }

  const allowlist = config.agents.defaults.models;
  // Clean out old blockrun entries not in TOP_MODELS
  const topSet = new Set(TOP_MODELS.map(id => 'blockrun/' + id));
  for (const key of Object.keys(allowlist)) {
    if (key.startsWith('blockrun/') && !topSet.has(key)) {
      delete allowlist[key];
    }
  }
  let added = 0;
  for (const id of TOP_MODELS) {
    const key = 'blockrun/' + id;
    if (!allowlist[key]) {
      allowlist[key] = {};
      added++;
    }
  }

  // Atomic write
  const tmpPath = configPath + '.tmp.' + process.pid;
  fs.writeFileSync(tmpPath, JSON.stringify(config, null, 2));
  fs.renameSync(tmpPath, configPath);

  if (added > 0) {
    console.log('  Added ' + added + ' models to allowlist (' + TOP_MODELS.length + ' total)');
  } else {
    console.log('  Allowlist already up to date');
  }
} catch (err) {
  console.log('  Migration skipped: ' + err.message);
}
"

# ── Summary ─────────────────────────────────────────────────────
echo ""
echo "✓ ClawRouter updated successfully!"
echo ""

# Show final wallet address
if [ -f "$WALLET_FILE" ]; then
  FINAL_KEY=$(cat "$WALLET_FILE" | tr -d '[:space:]')
  FINAL_ADDRESS=$(node -e "
    try {
      const { privateKeyToAccount } = require('$HOME/.openclaw/extensions/clawrouter/node_modules/viem/accounts/index.js');
      console.log(privateKeyToAccount('$FINAL_KEY').address);
    } catch { console.log('(run /wallet in OpenClaw to see your address)'); }
  " 2>/dev/null || echo "(run /wallet in OpenClaw to see your address)")

  echo "  Wallet: $FINAL_ADDRESS"
  echo "  Key file: $WALLET_FILE"
  if [ -n "$WALLET_BACKUP" ]; then
    echo "  Backup: $WALLET_BACKUP"
  fi
fi

echo ""
echo "  Run: openclaw gateway restart"
echo ""
echo "  Commands:"
echo "    npx @blockrun/clawrouter report            # daily usage report"
echo "    npx @blockrun/clawrouter report weekly      # weekly report"
echo "    npx @blockrun/clawrouter report monthly     # monthly report"
echo "    npx @blockrun/clawrouter doctor             # AI diagnostics"
echo ""
echo "  ⚠  Back up your wallet key: /wallet export  (in OpenClaw)"
echo ""
