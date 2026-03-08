# Three.js Mobile Patterns

## Baseline Setup

- One `Scene`, one `PerspectiveCamera`, one `WebGLRenderer`.
- Fixed internal resolution with pixel ratio clamp:
  - `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))`
- Single `requestAnimationFrame` loop.

## Performance Defaults

- Minimize draw calls and material switches.
- Use low-poly primitives unless custom geometry is essential.
- Avoid transparent layered effects unless necessary.
- Reuse vectors/quaternions in update loop to reduce allocations.

## Input Patterns

- Prefer pointer/touch controls with large hit areas.
- Keep camera movement simple (follow or fixed orbit).
- Avoid complex gesture stacks in first implementation.

## Game Loop Contract

- Separate simulation update from render bookkeeping.
- Keep score and fail condition deterministic.
- Ensure restart resets all mutable state and scene entities.

## Common Pitfalls

- High device pixel ratio causing low FPS.
- Too many dynamic lights and real-time shadows.
- Per-frame object creation in hot path.

