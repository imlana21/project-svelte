# state/ — MODEL Layer (Data)

Application-wide source of truth (Svelte stores/runes).

Rules:
- One store per domain (example : `auth.store.ts`, `cart.store.ts`)
- May call `services/` internally to sync/fetch, shape data via `types/`
- Only `hooks/` reads/writes stores — never `components/` directly
- No UI/DOM logic inside store files 