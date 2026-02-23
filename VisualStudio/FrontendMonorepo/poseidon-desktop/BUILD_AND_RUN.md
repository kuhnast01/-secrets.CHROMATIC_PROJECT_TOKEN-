# Poseidon Desktop Build & Run Guide

## Build Process (Electron Main)

1. **Install dependencies**
   ```sh
   pnpm install
   pnpm add electron --save-dev
   pnpm add @types/electron --save-dev
   pnpm add node-fetch
   pnpm add @types/node-fetch --save-dev
   pnpm add @types/node --save-dev
   ```

2. **Build main process**
   ```sh
   pnpm run build:main
   # or
   npx tsc -p tsconfig.main.json
   ```
   - Output: `dist/main/ipc/system.js`, `dist/main/ipc/adminPanel.js`, etc.

3. **Run Electron app**
   ```sh
   pnpm dev
   # or
   electron ./dist/main/app.js
   ```

## Troubleshooting
- If no .js files are emitted, run `npx tsc -p tsconfig.main.json` and check for errors.
- Ensure `tsconfig.main.json` uses `"module": "esnext"` for import.meta.url support.
- All required types must be installed as dev dependencies.

## Best Practices
- Always check build output before launching Electron.
- Keep dependencies and type definitions up to date.
- Document any custom build steps in this file.
