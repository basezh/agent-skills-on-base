# Remix Skills

Best practices, references, and templates for building games on Remix via API-driven agent workflows.

## What is Remix.gg?

[Remix.gg](https://remix.gg) is a platform for creating, publishing, and iterating on web games. These docs focus on using Remix's agent APIs so assistants and backend services can programmatically create and manage game drafts, code updates, and validation checks.

## Installation

```bash
npx skills add farworld-labs/remix-skills
```

## Skills

| Skill | Description |
|-------|-------------|
| [remix-agent-publish](skills/remix-agent-publish/SKILL.md) | Build and publish Remix games via the v1 REST API and Remix Game SDK |
| [remix-api-auth](skills/remix-api-auth/SKILL.md) | Configure and verify bearer API key authentication for Remix APIs |
| [remix-api-reference](skills/remix-api-reference/SKILL.md) | OpenAPI-first endpoint reference for Remix game publishing REST routes |
| [remix-glossary](skills/remix-glossary/SKILL.md) | Glossary of terms used in Remix agent publishing flows |
| [remix-mcp-quickstart](skills/remix-mcp-quickstart/SKILL.md) | Quickstart workflow for AI assistants using Remix publishing APIs |
| [remix-rest-snippets](skills/remix-rest-snippets/SKILL.md) | REST client snippets for Remix agent publishing |
| [remix-game-sdk](skills/remix-game-sdk/SKILL.md) | Reference for the @remix-gg/sdk game integration hooks and APIs |
| [remix-submission-rules](skills/remix-submission-rules/SKILL.md) | Validation and publish constraints for Remix game submissions |
| [remix-game-best-practices](skills/remix-game-best-practices/SKILL.md) | Mobile-first game creation best practices for Remix |
| [remix-open-game](skills/remix-open-game/SKILL.md) | Open a game in the Remix Studio browser for preview and editing |
| [remix-game-creation](skills/remix-game-creation/SKILL.md) | Create a new game draft via the Remix API |
| [remix-upload-game](skills/remix-upload-game/SKILL.md) | Upload version code to a Remix game |
| [remix-add-image](skills/remix-add-image/SKILL.md) | Generate and add images to a Remix game |
| [remix-add-sprite](skills/remix-add-sprite/SKILL.md) | Generate and add sprites to a Remix game |
| [remix-multiplayer](skills/remix-multiplayer/SKILL.md) | Enable multiplayer support for a Remix game |
| [remix-save-game](skills/remix-save-game/SKILL.md) | Add save and load game state functionality via RemixSDK |
| [remix-shop-items](skills/remix-shop-items/SKILL.md) | Create and manage in-game shop items for a Remix game |
| [remix-upload-asset](skills/remix-upload-asset/SKILL.md) | Upload images, audio, or 3D models as hosted game assets |
| [phaser-2d-arcade](skills/phaser-2d-arcade/SKILL.md) | Build mobile-first 2D browser games with Phaser 3 Arcade Physics |
| [threejs-lite](skills/threejs-lite/SKILL.md) | Build lightweight mobile-friendly 3D browser games with Three.js |

## API Key Setup

1. Log in to your Remix account.
2. Open `https://remix.gg/api-keys`.
3. Generate a new API key.
4. Store it securely and use it as a bearer token.

## Quick Start

```ts
const baseUrl = 'https://api.remix.gg'

// 0) fetch the live contract first
const openApiSpec = await fetch(`${baseUrl}/docs/json`).then((r) => r.json())

// 1) create draft game
const create = await fetch(`${baseUrl}/v1/games`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ name: 'Neon Dash' }),
}).then((r) => r.json())

const gameId = create.data.game.id
const versionId = create.data.game.version.id

// 2) update current version code
await fetch(`${baseUrl}/v1/games/${gameId}/versions/${versionId}/code`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ code: html }),
})

// 3) validate blockers
const report = await fetch(
  `${baseUrl}/v1/games/${gameId}/versions/${versionId}/validate`,
  { method: 'GET', headers },
).then((r) => r.json())

// 4) check status
await fetch(`${baseUrl}/v1/games/${gameId}/versions/${versionId}/status`, {
  method: 'GET',
  headers,
})
```

## Additional Read Endpoints

- `GET /v1/metadata/categories`
- `GET /v1/games`
- `GET /v1/games/{gameId}`
- `GET /v1/games/{gameId}/versions`
- `GET /v1/games/{gameId}/versions/{versionId}`
- `GET /v1/games/{gameId}/versions/{versionId}/code`
- `GET /v1/games/{gameId}/versions/{versionId}/thread`
- `GET /v1/games/{gameId}/assets`
- `GET /v1/games/{gameId}/items`
- `GET /v1/games/{gameId}/launch-readiness?versionId={versionId}`

## Asset Uploads

Asset uploads are available via `POST /v1/games/{gameId}/assets`. You can upload binary files (icons, sprites, audio) directly through the API or through the Remix app/Studio flow.

## Auth Model (Current Pass)

This repo documents the current model:
- API keys created in `https://remix.gg/api-keys`
- bearer auth (`Authorization: Bearer <api_key>`)
- ownership checks + lightweight rate limiting
- no agent REST submit endpoint
- docs fallback at `https://api.remix.gg/docs`
