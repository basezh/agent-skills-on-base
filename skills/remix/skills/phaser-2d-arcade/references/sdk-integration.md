# Remix Integration

Use this when Phaser output is intended for Remix agent publishing.

## Required Hooks

Implement all of these:

- Include SDK script in `<head>`:
  - `<script src="https://cdn.jsdelivr.net/npm/@remix-gg/sdk@latest/dist/index.min.js"></script>`
- `window.RemixSDK.singlePlayer.actions.gameOver({ score })`
- `window.RemixSDK.onPlayAgain(() => resetGame())`
- `window.RemixSDK.onToggleMute(({ isMuted }) => { ... })`

## Initialization Pattern

1. Wait for `await window.RemixSDK.ready()`.
2. Register `onPlayAgain` and `onToggleMute` once.
3. Keep a `finishGame(score)` function that always calls `gameOver`.

## Submission Safety

- Keep final output as single-file HTML when using Remix agent code upload.
- If your game needs external images/audio, upload them in Remix Studio/app flow and reference URLs returned by `GET /v1/games/{gameId}/assets`.
- Ensure score is numeric and stable at game end.
- Do not rely on localStorage for authoritative progression.
- Ensure restart path fully resets Phaser scene state.
