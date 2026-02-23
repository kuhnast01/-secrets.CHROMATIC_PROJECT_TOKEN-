# Admin Dashboard App

Vite-based admin dashboard application.

## Key Files
- `main.tsx` app bootstrap
- `src/` dashboard source
- `ADMIN_CHECKLIST.md` launch/readiness checklist


## Common Commands
- `pnpm --filter admin-dashboard dev`
- `pnpm --filter admin-dashboard build`


## Testing
- Run tests: `pnpm --filter admin-dashboard test`
- Example test: `src/pages/Users.test.tsx` covers UI and logic for Users page.
- Stress/edge tests: `src/pages/Users.stress.test.tsx` covers rapid actions, API failures, empty states, and drag-and-drop with many blocks.

## Best Practices
- Always test edge cases and stress scenarios for reliability.
- Document troubleshooting steps and test coverage for easier maintenance.

## Troubleshooting
- If build fails, check for duplicate imports, missing default exports, or variable order issues in `src/pages/Users.tsx`.
- For drag-and-drop issues, verify @dnd-kit and SortableContext usage.
- For API errors, check backend connectivity and endpoint paths.

## Maintenance
- Keep tests and documentation up to date for easier troubleshooting and onboarding.
