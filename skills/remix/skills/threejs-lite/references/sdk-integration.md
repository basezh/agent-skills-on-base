# Remix Integration

Use this when Three.js output is intended for Remix agent publishing.

## Required Hooks

Implement all of these:

- Include SDK script in `<head>`:
  - `<script src="https://cdn.jsdelivr.net/npm/@remix-gg/sdk@latest/dist/index.min.js"></script>`
- `window.RemixSDK.singlePlayer.actions.gameOver({ score })`
- `window.RemixSDK.onPlayAgain(() => resetGame())`
- `window.RemixSDK.onToggleMute(({ isMuted }) => { ... })`

## Integration Pattern

1. Wait for `await window.RemixSDK.ready()`.
2. Register mute/play-again handlers once.
3. Route game end through a single `finishGame(score)` function.

## Submission Safety

- Keep output single-file HTML for Remix code upload path.
- If your game needs external textures/audio, upload them in Remix Studio/app flow and reference URLs returned by `GET /v1/games/{gameId}/assets`.
- Keep score numeric and deterministic.
- Fully reset scene/game state on replay.
- Avoid dependencies on browser storage for core game state.
