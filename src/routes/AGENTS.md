# routes/ — VIEW Layer (Pages)

Top of View layer, SvelteKit file-based routing.

Rules:
- `+page.svelte`: render only, consume `hooks/` for state & actions — no direct `services/`/`state/` import
- `+page.ts` / `+page.server.ts`: SSR `load()` — the one allowed exception to call `services/` directly (framework data boundary, not component code)
- `+layout.svelte`: wraps `components/layout` shell
- No business logic inline — extract to `hooks/` or `services/`