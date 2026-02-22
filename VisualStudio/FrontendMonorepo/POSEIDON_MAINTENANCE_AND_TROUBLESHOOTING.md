# Poseidon UI & Platform Testing and Maintenance Guide

## Overview
This document describes the automated and manual testing strategy, troubleshooting steps, and maintenance best practices for the Poseidon UI and the full platform.

---

## Test Types & Coverage

### 1. White Box Testing
- **Path Testing:** Ensure all code paths are covered by unit/integration tests.
- **Loop Testing:** Validate all loops with edge-case unit tests.
- **Mutation Testing:** Use mutation tools to verify test effectiveness.

### 2. Black Box Testing
- **Functional:** Automated E2E and integration tests for all user flows.
- **Non-Functional:** Performance, security, and usability tests.
- **Regression:** Run full test suite after every change.

### 3. Gray Box Testing
- **State Transition:** Test stateful flows (e.g., login/logout, session expiry).
- **Data Flow:** Track and test variable usage across modules.

---

## Automated Test Scripts
- `pnpm --filter <project> test` — Runs all available tests for a project.
- `pnpm --filter <project> dev` — Starts the dev server for manual and exploratory testing.
- `pnpm run stress:smoke|spike|soak` (backend) — Runs performance and soak tests.

---

## Troubleshooting Checklist
1. **pnpm workspace issues:**
   - Validate `pnpm-workspace.yaml` for YAML syntax and correct project globs.
   - Run `pnpm -r list` to confirm all projects are detected.
2. **Dependency issues:**
   - Run `pnpm install` in the root and affected packages.
   - Check for missing modules in test output and add as needed.
3. **ESM/CJS errors:**
   - Ensure `type: module` in `package.json` for ESM projects.
   - Use `.cjs` for Jest config in ESM projects.
   - Use `tsx` for TypeScript ESM dev/test scripts.
4. **Electron issues:**
   - Confirm the dev server (Vite) is running on the port Electron expects.
   - Update `main.js` to match the correct port.
5. **Test failures:**
   - Read the error message for missing modules or config conflicts.
   - Reinstall dependencies and re-run tests.

---

## Maintenance Best Practices
- Keep all dependencies up to date with `pnpm update`.
- Regularly run all test suites before merging changes.
- Document any manual test steps or known issues in this file.
- Use CI/CD to automate tests and builds.
- Keep this documentation updated with new troubleshooting steps and test types.

---

## Quick Reference
- **Start backend:** `pnpm --filter liveops-backend dev`
- **Start web frontend:** `pnpm --filter web dev`
- **Start Poseidon UI:** `pnpm --filter poseidon-ui dev`
- **Run backend tests:** `pnpm --filter liveops-backend test`
- **Run web tests:** `pnpm --filter web test`
- **Add missing dependency:** `pnpm --filter <project> add <package>`

---

## Contact
For further help, contact the Poseidon engineering team or consult this file for updates.
