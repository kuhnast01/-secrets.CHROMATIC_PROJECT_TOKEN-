# Persistent @prisma/client Type Error in Monorepo Backend Tests

## Problem
Some backend tests may fail with:

```
TS2307: Cannot find module '@prisma/client' or its corresponding type declarations.
```

This can occur even after:
- Full dependency cleanup and reinstall
- Forced pnpm install with `--shamefully-hoist`
- Prisma client regeneration
- Correct tsconfig.json typeRoots and types

## Root Causes
- pnpm hoisting or symlink issues in monorepo setups
- TypeScript path/typeRoots resolution not matching test runner context
- Prisma client types not being generated or linked as expected

## Industry Best Practice Troubleshooting Steps
1. Ensure `@prisma/client` is installed at the workspace root.
2. Run `pnpm exec prisma generate` at the root and backend.
3. Check that `node_modules/@prisma/client` and its `.d.ts` files exist at the root.
4. Verify backend `tsconfig.json` includes `./node_modules/@prisma/client` in `typeRoots`.
5. Run `pnpm install --shamefully-hoist --force` to flatten node_modules.
6. If still failing, try:
   - Deleting all `node_modules` and lockfiles again
   - Running `pnpm install --shamefully-hoist --force`
   - Regenerating Prisma client
   - Running tests again

## If All Else Fails
- This is a known pnpm/TypeScript/Prisma monorepo edge case ([see Prisma issue #15090](https://github.com/prisma/prisma/issues/15090)).
- Consider switching backend to npm/yarn, or using a custom script to copy Prisma types into backend.
- Document this for future maintainers and escalate to engineering leadership if blocking critical delivery.

---
_Last updated: 2026-02-20_
