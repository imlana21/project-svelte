# services/ — BUSINESS LOGIC Layer

Domain rules, validation, calculations, API/external orchestration. Framework-agnostic — no Svelte, no store imports.

Rules:
- One file per domain (`auth.service.ts`, `order.service.ts`)
- May import `types/` and `utils/` only
- Return typed data or throw typed errors — never touch `state/` or UI
- Must be testable standalone (pure input → output; side effects isolated to API calls)