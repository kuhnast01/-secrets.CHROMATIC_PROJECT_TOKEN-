# Recommended Monorepo Folder Structure

- apps/           # Frontend and mobile apps (each with its own package.json)
- backend/        # Backend API/services (with package.json)
- packages/       # Shared libraries/modules (each with package.json)
- scripts/        # Utility and automation scripts
- docs/           # Documentation and runbooks
- .github/        # CI/CD workflows
- .vscode/        # Editor config
- node_modules/   # Managed by pnpm, not committed
- dist/, build/   # Output folders, gitignored
- coverage/, test-results/, tmp/  # Temporary/test folders, gitignored
- .env, .env.example  # Environment config
- pnpm-workspace.yaml # Workspace config
- package.json    # Root config
- README.md       # Project overview

## Best Practices
- Each app, backend, and package should have its own package.json and scripts.
- Use .gitignore to exclude build, coverage, logs, and temp files.
- Keep documentation and scripts organized in dedicated folders.
- Regularly clean up unused files and folders.
- Avoid cloud sync folders for active development.
- Use clear, consistent naming for all folders and files.
