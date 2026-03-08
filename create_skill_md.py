#!/usr/bin/env python3
"""Create SKILL.md from README.md with YAML frontmatter."""
import os
import re

SKILLS = [
    ("base", "https://github.com/base/skills"),
    ("virtual-protocol-acp", "https://github.com/Virtual-Protocol/openclaw-acp"),
    ("coinbase-agentic-wallet", "https://github.com/coinbase/agentic-wallet-skills"),
    ("privy-agentic-wallets", "https://github.com/privy-io/privy-agentic-wallets-skill"),
    ("clawlett", "https://github.com/Creator-Bid/Clawlett"),
    ("dx-terminal-pro", "https://github.com/ProjectDXAI/dx-terminal-pro-skill"),
    ("bankr", "https://github.com/BankrBot/skills"),
    ("uniswap-ai", "https://github.com/Uniswap/uniswap-ai"),
    ("opensea", "https://github.com/ProjectOpenSea/opensea-skill"),
    ("elsa", "https://github.com/HeyElsa/elsa-openclaw"),
    ("farcaster", "https://github.com/rishavmukherji/farcaster-agent"),
    ("xmtp", "https://github.com/xmtp/skills"),
    ("town", "https://github.com/towns-protocol/skills"),
    ("clawrouter", "https://github.com/BlockRunAI/ClawRouter"),
    ("heurist-mesh", "https://github.com/heurist-network/heurist-mesh-skill"),
    ("remix", "https://github.com/farworld-labs/remix-skills"),
]

def extract_description(content):
    """Extract first meaningful paragraph for description."""
    lines = content.strip().split('\n')
    desc_lines = []
    in_code = False
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if desc_lines:
                break
            continue
        if stripped.startswith('#') and not desc_lines:
            continue
        if stripped.startswith('![') or stripped.startswith('[!['):
            continue
        if '```' in stripped:
            in_code = not in_code
            continue
        if in_code:
            continue
        if stripped.startswith('|') and '---' in ''.join(lines):
            break
        if stripped.startswith('-') and len(desc_lines) > 0:
            break
        if stripped.startswith('*') and len(desc_lines) > 0:
            break
        desc_lines.append(stripped)
        if '.' in stripped and len(desc_lines) >= 1:
            break
    desc = ' '.join(desc_lines).strip()
    if len(desc) > 200:
        desc = desc[:197] + '...'
    return desc or "Skill documentation"

def main():
    base = "/Users/luochang/design/Base/basezh/github/agent-skills-on-base/skills"
    for name, homepage in SKILLS:
        readme_path = os.path.join(base, name, "README.md")
        skill_path = os.path.join(base, name, "SKILL.md")
        if not os.path.exists(readme_path):
            print(f"Skip {name}: no README.md")
            continue
        with open(readme_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        desc = extract_description(content)
        desc_escaped = desc.replace('"', '\\"').replace('\n', ' ')
        frontmatter = f'''---
name: {name}
description: "{desc_escaped}"
homepage: {homepage}
---

'''
        skill_content = frontmatter + content
        with open(skill_path, 'w', encoding='utf-8') as f:
            f.write(skill_content)
        print(f"Created {skill_path}")

if __name__ == "__main__":
    main()
