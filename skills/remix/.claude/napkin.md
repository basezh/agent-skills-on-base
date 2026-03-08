# Napkin

## 2026-02-09

- `.claude/napkin.md` was missing in this repo; created it to satisfy the per-session napkin workflow.
- Updated skill templates/docs to require loading `@farcade/game-sdk` via a `<script>` tag in `<head>` for Remix/Farcade HTML outputs.
- Replaced `@latest` with pinned `@0.3.0` after confirming current npm version via `npm view @farcade/game-sdk version`.
- Mistake: used zsh command substitution for file list and assumed shell word-splitting; fixed by piping `rg -l` into `xargs` for deterministic multi-file edits.
