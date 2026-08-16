# types/ — MODEL Layer (Contracts)

Shared data contracts (entities, DTOs) used across ≥2 files.

Rules:
- One domain per file, barrel via `index.ts` if needed
- Type-only, no runtime code
- `interface` for object shapes, `type` for unions/utility types
- Foundation layer — imports nothing from `lib/`