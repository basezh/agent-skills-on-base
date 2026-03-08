#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

kill_port_processes() {
  local port="$1"
  local pids=""

  if command -v lsof >/dev/null 2>&1; then
    pids="$(lsof -ti :"$port" 2>/dev/null || true)"
  elif command -v fuser >/dev/null 2>&1; then
    pids="$(fuser "$port"/tcp 2>/dev/null || true)"
  elif command -v ss >/dev/null 2>&1; then
    pids="$(ss -lptn "sport = :$port" 2>/dev/null | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' | sort -u)"
  elif command -v netstat >/dev/null 2>&1; then
    pids="$(netstat -nlpt 2>/dev/null | awk -v p=":$port" '$4 ~ p"$" {split($7,a,"/"); if (a[1] ~ /^[0-9]+$/) print a[1]}' | sort -u)"
  else
    echo "  Warning: could not find lsof/fuser/ss/netstat; skipping proxy stop"
    return 0
  fi

  if [ -n "$pids" ]; then
    echo "$pids" | xargs kill -9 2>/dev/null || true
  fi
}

echo "🦞 ClawRouter Reinstall"
echo ""

# 0. Back up wallet key BEFORE removing anything
WALLET_FILE="$HOME/.openclaw/blockrun/wallet.key"
WALLET_BACKUP=""

echo "→ Backing up wallet..."
if [ -f "$WALLET_FILE" ]; then
  WALLET_KEY=$(cat "$WALLET_FILE" | tr -d '[:space:]')
  KEY_LEN=${#WALLET_KEY}
  if [[ "$WALLET_KEY" == 0x* ]] && [ "$KEY_LEN" -eq 66 ]; then
    WALLET_BACKUP="$HOME/.openclaw/blockrun/wallet.key.bak.$(date +%s)"
    cp "$WALLET_FILE" "$WALLET_BACKUP"
    chmod 600 "$WALLET_BACKUP"
    echo "  ✓ Wallet backed up to: $WALLET_BACKUP"
  else
    echo "  ⚠ Wallet file exists but has invalid format — skipping backup"
  fi
else
  echo "  ℹ No existing wallet found"
fi
echo ""

# 1. Remove plugin files
echo "→ Removing plugin files..."
rm -rf ~/.openclaw/extensions/clawrouter

# 2. Clean config entries
echo "→ Cleaning config entries..."
node -e "
const f = require('os').homedir() + '/.openclaw/openclaw.json';
const fs = require('fs');
if (!fs.existsSync(f)) {
  console.log('  No openclaw.json found, skipping');
  process.exit(0);
}

let c;
try {
  c = JSON.parse(fs.readFileSync(f, 'utf8'));
} catch (err) {
  const backupPath = f + '.corrupt.' + Date.now();
  console.error('  ERROR: Invalid JSON in openclaw.json');
  console.error('  ' + err.message);
  try {
    fs.copyFileSync(f, backupPath);
    console.log('  Backed up to: ' + backupPath);
  } catch {}
  console.log('  Skipping config cleanup...');
  process.exit(0);
}

// Clean plugin entries
if (c.plugins?.entries?.clawrouter) delete c.plugins.entries.clawrouter;
if (c.plugins?.installs?.clawrouter) delete c.plugins.installs.clawrouter;
// Clean plugins.allow (removes stale clawrouter reference)
if (Array.isArray(c.plugins?.allow)) {
  c.plugins.allow = c.plugins.allow.filter(p => p !== 'clawrouter' && p !== '@blockrun/clawrouter');
}
// Remove deprecated model aliases from picker
const deprecated = ['blockrun/mini', 'blockrun/nvidia', 'blockrun/gpt', 'blockrun/o3', 'blockrun/grok'];
if (c.agents?.defaults?.models) {
  for (const key of deprecated) {
    if (c.agents.defaults.models[key]) {
      delete c.agents.defaults.models[key];
      console.log('  Removed deprecated alias: ' + key);
    }
  }
}
fs.writeFileSync(f, JSON.stringify(c, null, 2));
console.log('  Config cleaned');
"

# 3. Kill old proxy
echo "→ Stopping old proxy..."
kill_port_processes 8402

# 3.1. Remove stale models.json so it gets regenerated with apiKey
echo "→ Cleaning models cache..."
rm -f ~/.openclaw/agents/main/agent/models.json 2>/dev/null || true

# 4. Inject auth profile (ensures blockrun provider is recognized)
echo "→ Injecting auth profile..."
node -e "
const os = require('os');
const fs = require('fs');
const path = require('path');
const authDir = path.join(os.homedir(), '.openclaw', 'agents', 'main', 'agent');
const authPath = path.join(authDir, 'auth-profiles.json');

// Create directory if needed
fs.mkdirSync(authDir, { recursive: true });

// Load or create auth-profiles.json with correct OpenClaw format
let store = { version: 1, profiles: {} };
if (fs.existsSync(authPath)) {
  try {
    const existing = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    // Migrate if old format (no version field)
    if (existing.version && existing.profiles) {
      store = existing;
    } else {
      // Old format - keep version/profiles structure, old data is discarded
      store = { version: 1, profiles: {} };
    }
  } catch (err) {
    console.log('  Warning: Could not parse auth-profiles.json, creating fresh');
  }
}

// Inject blockrun auth if missing (OpenClaw format: profiles['provider:profileId'])
const profileKey = 'blockrun:default';
if (!store.profiles[profileKey]) {
  store.profiles[profileKey] = {
    type: 'api_key',
    provider: 'blockrun',
    key: 'x402-proxy-handles-auth'
  };
  fs.writeFileSync(authPath, JSON.stringify(store, null, 2));
  console.log('  Auth profile created');
} else {
  console.log('  Auth profile already exists');
}
"

# 5. Ensure apiKey is present for /model picker (but DON'T override default model)
echo "→ Finalizing setup..."
node -e "
const os = require('os');
const fs = require('fs');
const path = require('path');
const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');

if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    let changed = false;

    // Ensure blockrun provider has apiKey (required by ModelRegistry for /model picker)
    if (config.models?.providers?.blockrun && !config.models.providers.blockrun.apiKey) {
      config.models.providers.blockrun.apiKey = 'x402-proxy-handles-auth';
      console.log('  Added apiKey to blockrun provider config');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }
  } catch (e) {
    console.log('  Could not update config:', e.message);
  }
} else {
  console.log('  No openclaw.json found, skipping');
}
"

# 6. Install plugin (config is ready, but no allow list yet to avoid validation error)
echo "→ Installing ClawRouter..."
openclaw plugins install @blockrun/clawrouter

# 6.1. Verify installation (check dist/ files exist)
echo "→ Verifying installation..."
DIST_PATH="$HOME/.openclaw/extensions/clawrouter/dist/index.js"
if [ ! -f "$DIST_PATH" ]; then
  echo "  ⚠️  dist/ files missing, clearing npm cache and retrying..."
  npm cache clean --force 2>/dev/null || true
  rm -rf ~/.openclaw/extensions/clawrouter
  openclaw plugins install @blockrun/clawrouter

  if [ ! -f "$DIST_PATH" ]; then
    echo "  ❌ Installation failed - dist/index.js still missing"
    echo "  Please report this issue at https://github.com/BlockRunAI/ClawRouter/issues"
    exit 1
  fi
fi
echo "  ✓ dist/index.js verified"

# 6.2. Populate model allowlist so top BlockRun models appear in /model picker
echo "→ Populating model allowlist..."
node -e "
const os = require('os');
const fs = require('fs');
const path = require('path');

const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');
if (!fs.existsSync(configPath)) {
  console.log('  No openclaw.json found, skipping');
  process.exit(0);
}

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  let changed = false;

  // Ensure provider exists with apiKey
  if (!config.models) config.models = {};
  if (!config.models.providers) config.models.providers = {};
  if (!config.models.providers.blockrun) {
    config.models.providers.blockrun = { api: 'openai-completions', models: [] };
    changed = true;
  }
  if (!config.models.providers.blockrun.apiKey) {
    config.models.providers.blockrun.apiKey = 'x402-proxy-handles-auth';
    changed = true;
  }

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
    changed = true;
  }

  const allowlist = config.agents.defaults.models;
  // Clean out old blockrun entries not in TOP_MODELS
  const topSet = new Set(TOP_MODELS.map(id => 'blockrun/' + id));
  for (const key of Object.keys(allowlist)) {
    if (key.startsWith('blockrun/') && !topSet.has(key)) {
      delete allowlist[key];
      changed = true;
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
  if (added > 0) {
    changed = true;
    console.log('  Added ' + added + ' models to allowlist (' + TOP_MODELS.length + ' total)');
  } else {
    console.log('  Allowlist already up to date');
  }
  if (changed) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
} catch (err) {
  console.log('  Could not update config:', err.message);
}
"

# 7. Add plugin to allow list (done AFTER install so plugin files exist for validation)
echo "→ Adding to plugins allow list..."
node -e "
const os = require('os');
const fs = require('fs');
const path = require('path');
const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');

if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Ensure plugins.allow exists and includes clawrouter
    if (!config.plugins) config.plugins = {};
    if (!Array.isArray(config.plugins.allow)) {
      config.plugins.allow = [];
    }
    if (!config.plugins.allow.includes('clawrouter') && !config.plugins.allow.includes('@blockrun/clawrouter')) {
      config.plugins.allow.push('clawrouter');
      console.log('  Added clawrouter to plugins.allow');
    } else {
      console.log('  Plugin already in allow list');
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (e) {
    console.log('  Could not update config:', e.message);
  }
} else {
  console.log('  No openclaw.json found, skipping');
}
"

# Final: verify wallet survived reinstall
echo "→ Verifying wallet integrity..."
if [ -f "$WALLET_FILE" ]; then
  CURRENT_KEY=$(cat "$WALLET_FILE" | tr -d '[:space:]')
  CURRENT_LEN=${#CURRENT_KEY}
  if [[ "$CURRENT_KEY" == 0x* ]] && [ "$CURRENT_LEN" -eq 66 ]; then
    echo "  ✓ Wallet key intact"
  else
    if [ -n "$WALLET_BACKUP" ] && [ -f "$WALLET_BACKUP" ]; then
      cp "$WALLET_BACKUP" "$WALLET_FILE"
      chmod 600 "$WALLET_FILE"
      echo "  ✓ Wallet restored from backup"
    fi
  fi
else
  if [ -n "$WALLET_BACKUP" ] && [ -f "$WALLET_BACKUP" ]; then
    mkdir -p "$(dirname "$WALLET_FILE")"
    cp "$WALLET_BACKUP" "$WALLET_FILE"
    chmod 600 "$WALLET_FILE"
    echo "  ✓ Wallet restored from backup: $WALLET_BACKUP"
  fi
fi

echo ""
echo "✓ Done! Smart routing enabled by default."
echo ""
echo "Run: openclaw gateway restart"
echo ""
echo "Model aliases available:"
echo "  /model sonnet    → claude-sonnet-4"
echo "  /model opus      → claude-opus-4"
echo "  /model codex     → openai/gpt-5.2-codex"
echo "  /model deepseek  → deepseek/deepseek-chat"
echo "  /model minimax   → minimax/minimax-m2.5"
echo "  /model free      → gpt-oss-120b (FREE)"
echo ""
echo "Image generation:"
echo "  /imagegen <prompt>                           # default: nano-banana"
echo "  /imagegen --model dall-e-3 <prompt>          # DALL-E 3"
echo "  /imagegen --model gpt-image <prompt>         # GPT Image 1"
echo ""
echo "CLI commands:"
echo "  npx @blockrun/clawrouter report            # daily usage report"
echo "  npx @blockrun/clawrouter report weekly      # weekly report"
echo "  npx @blockrun/clawrouter report monthly     # monthly report"
echo "  npx @blockrun/clawrouter doctor             # AI diagnostics"
echo ""
echo "To uninstall: bash ~/.openclaw/extensions/clawrouter/scripts/uninstall.sh"
