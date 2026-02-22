
# Module Boundaries and Structure

This monorepo is organized for maximum modularity, scalability, and maintainability. Follow these guidelines to keep code decoupled and reusable:

## Directory Structure

- `apps/` — Application entry points (web, mobile, admin-dashboard, admin-panel). No business logic here.
- `packages/` — Shared code (api, models, ui). All business logic, types, and shared utilities live here.
- `e2e/` — End-to-end tests.

## Module Boundaries

- **No cross-app imports:** Apps must not import code from other apps.
- **Shared logic:** Place all reusable logic, types, and UI in `packages/`.
- **API contracts:** Define all API types and interfaces in `packages/models`.
- **UI components:** Place all reusable UI in `packages/ui`.
- **API clients:** Place all API communication logic in `packages/api`.

## Dependency Rules

- Apps can depend on any package in `packages/`.
- Packages must not depend on any app.
- Packages should avoid circular dependencies.

## Enforcing Boundaries

- Use TypeScript project references for strict boundaries.
- Use dependency graph tools (e.g., depcheck, madge) to visualize and enforce boundaries.
- Add lint rules to prevent cross-app imports.

## Adding New Modules

- Add new shared logic to `packages/`.
- Document new modules in their own README.md.

## Reviewing Changes

- All PRs must be reviewed for boundary violations.
- Use automated tools to check for dependency cycles and cross-app imports.

## CI Reliability Guardrails

- Backend stress workflows enforce canonical artifact validation after upload.
- Minimum validated canonical artifact counts are required: nightly `>=1`, weekly `>=2` (spike + soak).

---

_Keep this document updated as the architecture evolves._
