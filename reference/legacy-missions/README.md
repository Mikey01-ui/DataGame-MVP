# Legacy missions — reference only

Original static HTML missions live **here** (moved out of the repo root). **Do not edit these for new features** — rebuild logic in `web/components/missions/` and `web/lib/game/`.

The static playtest hub (`index.html`) links into this folder. The Next.js app serves the same files at `/reference/legacy-missions/` via `web/public/reference/legacy-missions/`.

## Contents

| File | Description |
|------|-------------|
| `Mission 1.html` … `Mission 5.html` | Full original gameplay (HTML + CSS + JS inline) |
| `Mission * Tutorial.html` | Tutorial variants |
| `m3-routing-shared.js` | Mission 3 routing helper |
| `playtest-mission-nav.js` | Playtest nav overlay |
| `m5-tutorial-engine.js` | Mission 5 tutorial engine |
| `assets/` | Shared images referenced by missions |

## React migration

Active development lives in:

- `web/components/missions/mN/` — UI components per mission
- `web/content/missions/mN/` — copy, protocol steps, game data JSON
- `web/lib/game/mN/` — state machines and scoring (add as you migrate)

Open a legacy file side-by-side when porting a screen or mechanic.
