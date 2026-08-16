# utils/ — INFRASTRUCTURE Layer

Pure, stateless helper functions (format, math, string ops).

Rules:
- No side effects, no API/store access, no Svelte imports
- Must be unit-testable in isolation
- `index.ts` = barrel export; split by domain as it grows (`date.ts`, `string.ts`)