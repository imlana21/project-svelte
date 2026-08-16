# lib/ — Layered Architecture

```
┌────────────────┐
│ VIEW            │  routes/, components/ui, components/layout
├────────────────┤
│ VIEWMODEL       │  hooks/
├────────────────┤
│ BUSINESS LOGIC  │  services/
├────────────────┤
│ MODEL           │  state/, types/
├────────────────┤
│ INFRASTRUCTURE  │  utils/, assets/
└────────────────┘
```

Strict rule: a layer may only depend on the layer directly below it. No skipping (e.g. View must never call `services/` or `state/` directly).

| Layer | Folder(s) | Responsibility | May depend on | Must NOT touch |
|---|---|---|---|---|
| View | `routes/`, `components/ui`, `components/layout` | Render UI, capture input | ViewModel | services/, state/ directly |
| ViewModel | `hooks/` | Bridge View ↔ logic; expose reactive state & actions | Business Logic, Model | components/ (no markup) |
| Business Logic | `services/` | Domain rules, validation, API orchestration | Model (`types/`) | state/, hooks/, components/ |
| Model | `state/`, `types/` | Source of truth for data + contracts | Business Logic, Infra | View, ViewModel |
| Infrastructure | `utils/`, `assets/` | Pure helpers, static files | nothing internal | everything above |

Each folder's own `AGENT.md` has layer-specific detail — read it before editing a file there.