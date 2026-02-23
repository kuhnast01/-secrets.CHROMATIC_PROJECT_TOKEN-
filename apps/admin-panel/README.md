
# Admin Panel (Next.js)

This is the admin panel for the SIMgame platform, built with Next.js and managed as part of the monorepo.

## Getting Started

1. Install dependencies (from monorepo root):

```sh
pnpm install
```

1. Build shared packages (from monorepo root):

```sh
pnpm run build --filter api
pnpm run build --filter models
pnpm run build --filter ui
```

1. Start the admin panel:

```sh
pnpm --filter admin-panel dev
```

Open [http://localhost:3000](http://localhost:3000) to view the admin panel.

## Development

- Uses shared code from `packages/` via TypeScript path aliases.
- Follows monorepo code style and contribution guidelines.

## Deployment

- See monorepo root README for CI/CD and deployment details.
