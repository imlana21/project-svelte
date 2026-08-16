# hooks/ — VIEWMODEL Layer

Bridges View and Business Logic. Holds UI-facing reactive state, exposes actions/derived values to components.

Rules:
- Prefix `use*`
- May call `services/` and read/write `state/`
- Logic only — no markup, no DOM
- Don't import from `components/` (dependency flows View → ViewModel, never reverse)
- Framework-reactive glue lives here, not business rules (those belong in `services/`)