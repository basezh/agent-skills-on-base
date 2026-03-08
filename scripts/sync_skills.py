#!/usr/bin/env python3
"""
Sync SKILL.md and related files from original sources.
Run: python3 scripts/sync_skills.py [--all|skill-name]
"""
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SKILLS_DIR = REPO_ROOT / "skills"

# URL-based skills: (local_path, fetch_url)
URL_SKILLS = [
    ("sponge-wallet", "https://wallet.paysponge.com/skill.md"),
    ("moltlaunch", "https://moltlaunch.com/skill.md"),
    ("daydreams-taskmarket", "https://market.daydreams.systems/skill.md"),
    ("molten", "https://molten.gg/skill.md"),
    ("flow", "https://www.flow.bid/skill/skill.md"),
    ("frame", "https://frame.fun/skill.md"),
    ("fluid", "https://fluid.io/skill.md"),
    ("moltline", "https://www.moltline.com/skill.md"),
    ("basebario-fxclaw", "https://www.fxclaw.xyz/SKILL.md"),
    ("basebario-agentarcade", "https://aa.baes.app/_skill/SKILL.md"),
    ("claunch", "https://clawn.ch/skill.md"),
]

# GitHub repo skills: (local_path, repo, path_in_repo, branch)
GITHUB_SKILLS = [
    ("quicknode", "quiknode-labs/blockchain-skills", "skills/quicknode-skill", "main"),
    ("alchemy", "alchemyplatform/skills", "skills/alchemy-api", "main"),
]


def fetch_url(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "agent-skills-sync/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def fetch_github_tree(owner: str, repo: str, path: str, branch: str = "main") -> list:
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={branch}"
    req = urllib.request.Request(url, headers={"Accept": "application/vnd.github.v3+json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def fetch_github_raw(owner: str, repo: str, path: str, branch: str = "main") -> str:
    url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}"
    return fetch_url(url)


def download_tree(owner: str, repo: str, base_path: str, dest: Path, branch: str = "main"):
    try:
        items = fetch_github_tree(owner, repo, base_path, branch)
    except Exception as e:
        print(f"  Tree fetch failed: {e}")
        return
    for item in items:
        name = item["name"]
        full_path = f"{base_path}/{name}".replace("//", "/")
        dest_file = dest / name
        if item["type"] == "file":
            try:
                content = fetch_github_raw(owner, repo, full_path, branch)
                dest_file.parent.mkdir(parents=True, exist_ok=True)
                dest_file.write_text(content, encoding="utf-8")
                print(f"  OK {name}")
            except Exception as e:
                print(f"  FAIL {name}: {e}")
        else:
            download_tree(owner, repo, full_path, dest_file, branch)


def sync_url_skill(local_name: str, url: str) -> bool:
    dest = SKILLS_DIR / local_name / "SKILL.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        content = fetch_url(url)
        if "<!DOCTYPE" in content or "<html" in content.lower():
            print(f"  SKIP {local_name}: URL returned HTML")
            return False
        dest.write_text(content, encoding="utf-8")
        print(f"  OK {local_name}")
        return True
    except Exception as e:
        print(f"  FAIL {local_name}: {e}")
        return False


def sync_bankr_skills():
    """Sync entire BankrBot/skills into skills/bankr/"""
    dest = SKILLS_DIR / "bankr"
    dest.mkdir(parents=True, exist_ok=True)
    print("Syncing BankrBot/skills -> skills/bankr/")
    skill_dirs = [
        "bankr", "bankr-signals", "base", "botchan", "clanker", "endaoment",
        "ens-primary-name", "erc-8004", "hydrex", "neynar", "onchainkit",
        "qrcoin", "siwa", "veil", "yoink", "zapper"
    ]
    for sub in skill_dirs:
        sub_dest = dest / sub
        download_tree("BankrBot", "skills", sub, sub_dest, "main")
    try:
        readme = fetch_github_raw("BankrBot", "skills", "README.md", "main")
        (dest / "README.md").write_text(readme, encoding="utf-8")
        print("  OK README.md")
    except Exception as e:
        print(f"  FAIL README.md: {e}")
    try:
        onchainkit = fetch_github_raw("BankrBot", "skills", "onchainkit.skill", "main")
        (dest / "onchainkit.skill").write_text(onchainkit, encoding="utf-8")
        print("  OK onchainkit.skill")
    except Exception as e:
        print(f"  FAIL onchainkit.skill: {e}")


def fix_yaml_frontmatter(content: str) -> str:
    """Fix YAML frontmatter: quote scalars with colons; remove stray }, } before ---."""
    if not content.strip().startswith("---"):
        return content
    end = content.find("\n---", 3)
    if end < 0:
        return content
    fm = content[4:end]
    body = content[end + 4:]
    lines = fm.split("\n")
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if stripped in ("}", "},", "}, "):
            i += 1
            continue
        if ":" in line and not stripped.startswith("#"):
            key, _, val = line.partition(":")
            key = key.rstrip()
            val = val.lstrip()
            if val and not val.startswith(('"', "'", "[", "{", "|", ">")) and ":" in val:
                val = val.replace("\\", "\\\\").replace('"', '\\"')
                val = f'"{val}"'
            if key:
                out.append(f"{key}: {val}" if val else f"{key}:")
            else:
                out.append(line)
        else:
            out.append(line)
        i += 1
    return "---\n" + "\n".join(out) + "\n---" + body


def fix_all_yaml():
    """Fix YAML in all SKILL.md files."""
    for f in SKILLS_DIR.rglob("SKILL.md"):
        try:
            content = f.read_text(encoding="utf-8")
            fixed = fix_yaml_frontmatter(content)
            if fixed != content:
                f.write_text(fixed, encoding="utf-8")
                print(f"Fixed YAML: {f.relative_to(REPO_ROOT)}")
        except Exception as e:
            print(f"Error {f}: {e}")


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--fix-yaml":
        fix_all_yaml()
        return
    if len(sys.argv) > 1 and sys.argv[1] == "--bankr":
        sync_bankr_skills()
        return
    if len(sys.argv) > 1 and sys.argv[1] == "--urls":
        print("Syncing URL-based skills...")
        for local_name, url in URL_SKILLS:
            sync_url_skill(local_name, url)
        return
    if len(sys.argv) > 1 and sys.argv[1] == "--all":
        sync_bankr_skills()
        print("\nSyncing URL-based skills...")
        for local_name, url in URL_SKILLS:
            sync_url_skill(local_name, url)
        print("\nSyncing GitHub skills...")
        for local_name, repo, path, branch in GITHUB_SKILLS:
            owner, repo_name = repo.split("/")
            dest = SKILLS_DIR / local_name
            print(f"  {local_name} <- {repo}/{path}")
            download_tree(owner, repo_name, path, dest, branch)
        print("\nFixing YAML...")
        fix_all_yaml()
        return
    print(__doc__)
    print("Usage: python3 scripts/sync_skills.py [--all|--bankr|--urls|--fix-yaml]")


if __name__ == "__main__":
    main()
