# Chacha

Chacha is a browser-based, real-time multiplayer king-of-the-hill game. Players choose a battlefield and fighter, join one of four teams (North, South, East, or West), and fight to control the center hill until their team reaches 100%.

The public game is available at [chacha.alexzaprivera.chatgpt.site](https://chacha.alexzaprivera.chatgpt.site/).

## Features

- Public rooms with six-character room codes and no player accounts
- Solo practice matches with bots
- 81 selectable fighters, all unlocked
- Shibuya Crossing, Death Star Hangar, and Hidden Leaf Village battlefields
- Mouse-controlled third-person camera and configurable movement keys
- King-of-the-hill scoring, respawns, character switching, abilities, and ultimates
- Live player statistics including kills, deaths, assists, damage, and accuracy

## Run locally

Chacha requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by the development server, normally `http://127.0.0.1:5173`.

Useful commands:

```bash
npm run build
npm run lint
```

## Controls

- `W`, `A`, `S`, `D`: move
- Mouse or trackpad: turn the camera and aim
- Left click or trackpad click: fighter signature attack
- `E`: fighter power-up
- `X`: ultimate
- `Tab`: scoreboard and player statistics

Movement keys, mouse sensitivity, and inverted aim can be changed from Settings.

## Project structure

- `app/page.tsx`: menu flow, room UI, character selection, and match orchestration
- `app/CharacterPreview.tsx`: Three.js fighter preview renderer
- `app/Arena.tsx`: match renderer, camera, controls, effects, and arena geometry
- `app/game-data.ts`: fighter roster, tiers, abilities, maps, and team data
- `app/api/rooms/`: multiplayer room API
- `app/dark-theme.css`: menu and selection presentation
- `public/`: battlefield art, portraits, and menu imagery
- `.openai/hosting.json`: ChatGPT Sites project and D1 binding

## Multiplayer data

The hosted game uses the `DB` Cloudflare D1 binding declared in `.openai/hosting.json`. Local development uses the project’s Vinext/Wrangler setup. Never commit hosting credentials or short-lived deployment tokens.

## Continuing with another coding assistant

Give the assistant access to this repository and ask it to read `README.md` and `AGENTS.md` first. The repository contains the complete source and public assets; no context from the original ChatGPT conversation is required. Before publishing a change, run the TypeScript check, the gameplay tests in `tests/`, and `npm run build`.

The crossover characters and supplied imagery are used for this personal prototype. Review intellectual-property and licensing requirements before distributing or monetizing it.
