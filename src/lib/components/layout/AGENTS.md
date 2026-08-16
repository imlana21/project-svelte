# components/layout/ — VIEW (Structural)

Part of Components but only for structural layout UI (Navbar, Sidebar, Footer, Shell).

Rules:
- May consume `hooks/` (ViewModel) for reactive data/actions
- No direct `services/` or `state/` import — always through `hooks/`
- Naming: `PascalCase.svelte`