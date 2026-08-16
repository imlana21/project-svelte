# assets/ — INFRASTRUCTURE Layer

Static files (images, fonts, icons). No logic.

Rules:
- No `.ts`/`.svelte` logic except re-export barrels
- Optimize before commit (webp/svg preferred)
- Import via `$lib/assets/...`, not raw path strings