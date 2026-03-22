# Brandon Mai

A browser-based portfolio built with Vite, React, TypeScript, Phaser 3, and Tailwind CSS.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
.
├── index.html
├── package.json
├── postcss.config.cjs
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── src
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── vite-env.d.ts
    ├── components
    │   ├── GameCanvas.tsx
    │   ├── InteractionPrompt.tsx
    │   └── SectionModal.tsx
    ├── content
    │   └── portfolioSections.ts
    ├── game
    │   ├── createPortfolioGame.ts
    │   ├── gameEvents.ts
    │   ├── roomData.ts
    │   └── scenes
    │       └── PubScene.ts
    └── types
        └── portfolio.ts
```

## Architecture

- `src/game/scenes/PubScene.ts` owns the room, player movement, furniture collisions, proximity checks, and the `E` interaction trigger.
- `src/game/roomData.ts` keeps the interactables data-driven so adding a new portfolio hotspot only requires updating a config object.
- `src/game/gameEvents.ts` is the bridge between Phaser and React. Phaser emits nearby-interactable and open-section events; React listens and opens the matching panel.
- `src/components/SectionModal.tsx` and `src/content/portfolioSections.ts` keep portfolio content in React instead of Phaser UI.

## Interaction flow

1. The player walks near an interactable in Phaser.
2. Phaser emits the nearby interactable summary to React.
3. React shows the `Press E` prompt as a DOM overlay.
4. Pressing `E` in Phaser emits the section id.
5. React receives that id and opens the matching modal.
# portfolio-game
