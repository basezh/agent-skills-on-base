---
name: converting-minikit-to-farcaster
description: Converts Mini Apps from MiniKit (OnchainKit) to native Farcaster SDK. Use when migrating from @coinbase/onchainkit/minikit, converting MiniKit hooks, or removing MiniKitProvider.
---

# MiniKit to Farcaster SDK

## Breaking Changes (SDK v0.2.0+)

1. `sdk.context` is a **Promise** — must await
2. `sdk.isInMiniApp()` accepts **no parameters**
3. `sdk.actions.setPrimaryButton()` has no onClick callback

## Quick Reference

| MiniKit | Farcaster SDK |
|---------|---------------|
| `useMiniKit().setFrameReady()` | `await sdk.actions.ready()` |
| `useMiniKit().context` | `await sdk.context` |
| `useMiniKit().isSDKLoaded` | `await sdk.isInMiniApp()` |
| `useClose()` | `await sdk.actions.close()` |
| `useOpenUrl(url)` | `await sdk.actions.openUrl(url)` |
| `useViewProfile(fid)` | `await sdk.actions.viewProfile({ fid })` |
| `useComposeCast()` | `await sdk.actions.composeCast({ text, embeds })` |
| `usePrimaryButton(opts, cb)` | `await sdk.actions.setPrimaryButton(opts)` |

## Context Access

```typescript
// WRONG
const fid = sdk.context?.user?.fid;

// CORRECT
const context = await sdk.context;
const fid = context?.user?.fid;
```

## Conversion Workflow

1. Verify Node.js >= 22.11.0
2. Replace imports: `@coinbase/onchainkit/minikit` → `@farcaster/miniapp-sdk`
3. Convert hooks using reference above
4. Add FrameProvider
5. Update manifest: `frame` → `miniapp`

**Source**: [base/skills](https://github.com/base/skills)
