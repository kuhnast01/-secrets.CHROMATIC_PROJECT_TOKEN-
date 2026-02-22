# Testing & Troubleshooting Guide: admin-dashboard

## Test Philosophy & Coverage Goals
- **Unit tests:** Isolate and verify each component, hook, and utility.
- **Integration tests:** Validate interactions between modules/components.
- **End-to-end (E2E) tests:** Simulate real user flows in the browser.
- **Coverage:** Aim for 100% of critical logic, UI states, and edge cases.

## Running Tests
- **All tests:**
  ```sh
  pnpm --filter admin-dashboard test
  ```
- **Single file (if supported):**
  ```sh
  pnpm --filter admin-dashboard test -- src/pages/Users.test.tsx
  ```
  > If Jest reports "No tests found", run the full suite instead (see Troubleshooting).
- **E2E tests:**
  ```sh
  pnpm --filter admin-dashboard test:e2e
  ```

## Test Structure & Conventions
- Place unit/integration tests in `src/**/*.test.ts(x)` or `tests/**/*.test.ts(x)`.
- Use React Testing Library for React components.
- Use Playwright for E2E/browser tests.
- Name test files after the component/module they cover.

## Best Practices
- Use user-centric queries (`getByRole`, `getByLabelText`).
- Mock side effects (API, alert, navigation).
- Prefer `waitForElementToBeRemoved` for async UI (e.g., MUI Dialog).
- Keep tests isolated and deterministic.
- Cover all states: default, loading, error, edge cases.

## Troubleshooting
### Common Issues
- **No tests found:**
  - Ensure test file matches `*.test.ts(x)` and is in `src/` or `tests/`.
  - Run the full suite (`pnpm --filter admin-dashboard test`).
  - Check `jest.config.mjs` for correct `testMatch` and `rootDir`.
- **Async UI not updating:**
  - Use `waitFor` or `waitForElementToBeRemoved` for elements that unmount with animation (e.g., MUI Dialog).
- **Module not found:**
  - Check `moduleNameMapper` and `moduleDirectories` in Jest config.
- **Type errors:**
  - Ensure `tsconfig.json` includes all relevant type roots and types.
- **Playwright/E2E issues:**
  - Ensure Playwright is installed and configured in `package.json`.
  - Use `pnpm install` if dependencies are missing.

### Debugging Steps
1. Run tests with increased verbosity:
   ```sh
   pnpm --filter admin-dashboard test -- --verbose
   ```
2. Check for typos in file/folder names.
3. Review recent changes to Jest or TypeScript config.
4. Consult official docs:
   - [Jest](https://jestjs.io/docs/configuration)
   - [React Testing Library](https://testing-library.com/docs/)
   - [Playwright](https://playwright.dev/docs/intro)
   - [MUI](https://mui.com/material-ui/react-dialog/)
5. If unresolved, escalate to the team or open an issue.

## Updating & Adding Tests
- Add new tests for every new feature or bugfix.
- Update existing tests when refactoring components.
- Remove obsolete tests when features are removed.

## Contact & Escalation
- For persistent or blocking issues, contact the project maintainer or lead engineer.
- Document new troubleshooting steps in this file for future maintainers.
