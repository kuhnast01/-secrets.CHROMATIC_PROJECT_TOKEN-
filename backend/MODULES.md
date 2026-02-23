# Poseidon Backend Module Boundaries

This backend is organized for maintainability, scalability, and clear separation of concerns. Follow these guidelines to keep code modular and decoupled:

## Directory Structure
- `src/controllers/` — Route handlers and business logic entry points
- `src/models/` — Database models and ORM logic
- `src/routes/` — Express route definitions
- `src/middleware/` — Express middleware
- `src/utils/` — Shared utilities
- `src/types/` — Shared TypeScript types
- `src/poseidon/` — Core Poseidon logic and integrations

## Module Boundaries
- Controllers should not access the database directly; use models.
- Middleware should be stateless and reusable.
- Utilities must not import from controllers or routes.
- No circular dependencies between modules.

## Enforcing Boundaries
- Use TypeScript project references for strict boundaries (if possible).
- Use dependency graph tools (e.g., madge) to visualize and enforce boundaries.
- Add lint rules to prevent forbidden imports.

## Adding New Modules
- Place new business logic in the appropriate folder.
- Document new modules in their own README.md if complex.

## Reviewing Changes
- All PRs must be reviewed for boundary violations.
- Use automated tools to check for dependency cycles and cross-module imports.

---

_Keep this document updated as the architecture evolves._
