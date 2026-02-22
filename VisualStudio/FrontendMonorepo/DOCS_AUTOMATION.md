# Documentation Automation

This project uses automated tools to keep documentation up to date and accessible for all contributors.

## API Documentation

- All TypeScript types and API contracts are documented in `packages/models` and `packages/api`.
- To generate API docs, run:
  ```sh
  npx typedoc --out docs/api packages/api/src
  ```
- Generated docs are output to `docs/api`.

## UI Component Documentation

- All reusable UI components are documented in Storybook.
- To run Storybook locally:
  ```sh
  pnpm storybook
  ```
- To build static docs:
  ```sh
  pnpm build-storybook
  ```

## Keeping Docs Up to Date

- All new features and components must include documentation updates.
- PRs are checked for missing or outdated docs.
- Docs are published automatically with each release.

## Contributing

- See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on writing and updating documentation.

---

_This file is generated and updated automatically. Do not edit directly._
