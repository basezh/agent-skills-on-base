# Phaser Arcade Patterns

## Minimal Scene Structure

- `preload()`: load only assets needed for first playable loop.
- `create()`: instantiate player, hazards, score UI, input bindings.
- `update()`: read input, apply movement, resolve fail/win transitions.

## Mobile-First Defaults

- Use a fixed internal resolution with `Phaser.Scale.FIT` and `CENTER_BOTH`.
- Favor tap zones / swipe gestures over keyboard-only controls.
- Keep UI text large enough for small devices.

## Performance Defaults

- Prefer simple sprite sheets and low overdraw backgrounds.
- Reuse objects (pools) for bullets/enemies if spawn rate is high.
- Avoid creating new arrays/objects every frame in `update()`.
- Keep collision graph minimal.

## Gameplay Contract

- Define one clear score source.
- Define one terminal condition (health <= 0, timer elapsed, etc.).
- Ensure restart resets all mutable state (timers, score, entities, flags).

## Typical Pitfalls

- Input listeners registered multiple times across restarts.
- Scene restart that leaves stale timers/events alive.
- Camera and world bounds mismatch on narrow mobile screens.

