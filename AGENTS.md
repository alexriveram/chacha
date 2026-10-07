# Chacha contributor notes

Read `README.md` before editing. Preserve the existing game flow:

1. Home screen
2. Play now
3. Battlefield selection
4. Fighter selection
5. Solo practice or multiplayer room
6. King-of-the-hill match

All fighters must remain selectable. The four teams are North, South, East, and West. The match objective is first to 100% hill control. Default movement is W/A/S/D, with A moving left and D moving right. Mouse movement controls the third-person camera; left click attacks.

Keep real-time room state authoritative on the server and avoid client-only multiplayer state. Maintain the adaptive rendering options in `Arena.tsx`; visual changes must not reintroduce the severe frame-rate problems fixed during development.

The interface uses a dark, cinematic console-game style. The battlefield screen starts with `public/play-menu-default.jpg`; each map scene appears only while its card is hovered or focused. Fighter selection uses a roster grid on the left, a large live fighter preview in the center, and identity, stats, and abilities on the right.

Run these checks before handing off changes:

```bash
node node_modules/typescript/bin/tsc --noEmit
npm run build
```

Also run the relevant files in `tests/` when changing gameplay, controls, rendering, room synchronization, scoring, or fighter data. Do not commit `.sites-runtime`, `.wrangler`, build output, credentials, or deployment tokens.
