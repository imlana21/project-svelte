# AGENT.md

Guide for AI coding agents (Claude Code, Cursor, etc) working in this repo.

## 1. Tech Stack
- SvelteKit
- Skeleton UI (skeleton.dev)
- TypeScript (strict)
- Tailwind CSS

## 2. Folder Structure
```
src/
├── lib/
│   ├── assets/          # images, fonts, static files
│   ├── components/
│   │   ├── layout/      # navbar, sidebar, footer...
│   │   └── ui/          # reusable UI (button, card, modal...)
│   ├── hooks/           # composables
│   ├── services/        # API calls, external integrations
│   ├── state/           # global stores
│   ├── types/           # shared types/interfaces
│   └── utils/
│       ├── index.ts     # barrel export
│       └── utils.ts     # helpers
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── layout.css
├── app.css              # Tailwind entry, global styles
├── app.d.ts
└── app.html
```
Rules:
- Shared UI → `lib/components/ui`; page-structure only → `lib/components/layout`
- API/fetch logic → `lib/services`, never inline in `.svelte`
- Types used in >1 place → `lib/types`
- Global state → `lib/state`

## 3. Layered Architecture

```
VIEW (routes, components/ui, components/layout)
  ↓
VIEWMODEL (hooks/)
  ↓
BUSINESS LOGIC (services/)
  ↓
MODEL (state/, types/)
  ↓
INFRASTRUCTURE (utils/, assets/)
```

Strict boundary: each layer only talks to the layer directly below it.
- **View**: renders UI, captures input. No `services/`/`state/` imports — only `hooks/`.
- **ViewModel** (`hooks/`): bridges View ↔ logic, exposes reactive state/actions. No markup.
- **Business Logic** (`services/`): domain rules, validation, API calls. Framework-agnostic, no store access.
- **Model** (`state/`, `types/`): source of truth for data + contracts.
- **Infrastructure** (`utils/`, `assets/`): pure helpers/static files, no upward knowledge.

Full detail + import matrix in `src/lib/AGENT.md`. Every folder under `src/` has its own `AGENT.md` — read the nearest one before editing.

## 4. Theme — OKLCH
All colors defined as OKLCH tokens in `app.css`:
```css
:root {
  --color-primary: oklch(62% 0.19 260);
  --color-secondary: oklch(70% 0.15 200);
  --color-surface: oklch(98% 0.01 260);
  --color-on-surface: oklch(20% 0.02 260);
  --color-error: oklch(58% 0.22 25);
}
[data-mode='dark'] {
  --color-surface: oklch(18% 0.01 260);
  --color-on-surface: oklch(95% 0.01 260);
}
```
Rules:
- New colors must use `oklch()`, no hex/rgb
- Keep hue constant per token; vary lightness for dark mode
- Map tokens to Tailwind via `theme.extend.colors`
- Skeleton theme generator OK as starting point, finalize to OKLCH tokens above

## 5. Coding Rules
- Strict TypeScript, no `any`
- Svelte 5 runes (`$state`, `$derived`, `$props`) — check `package.json` if unsure of version
- Tailwind utilities + theme tokens over inline styles
- Use Skeleton UI components before building custom ones
- Don't restructure folders without reason

## 6. Task Checklist
On every user command, follow in order:
1. Clarify if ambiguous — don't assume unstated scope
2. Read this file (stack, structure, theme, rules) first
3. Read related existing files before editing/creating
4. Check `package.json` before adding deps; reuse existing (e.g. Skeleton) first
5. Place new files per structure in §2
6. Implement: strict TS, OKLCH/Tailwind tokens, reuse `lib/components/ui`
7. Self-check: no TS errors, no unused imports, style matches surrounding code
8. Stay in scope — report unrelated bugs/issues found, don't fix unprompted
9. End with brief summary: files changed, and any follow-up steps (install, migration, etc.)

## 7. Project Details
> Fill in per project:
- Name:
- Description:
- Target users:
- Core features:
- Deployment:
- Backend/API: