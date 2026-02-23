# Security Policy

## Known Vulnerabilities

### minimatch (via jest, babel-plugin-istanbul)
- **Severity:** High
- **Issue:** ReDoS via repeated wildcards with non-matching literal in pattern
- **Patched Version:** >=10.2.1
- **Current Status:** Indirect dependency, cannot be patched directly due to upstream packages.

## Mitigation
- Monitor upstream packages (jest, babel-plugin-istanbul, glob) for security updates.
- Restrict exposure: Do not pass user input directly to minimatch patterns.
- Use lockfile audit and document risk.
- Review and update dependencies regularly.

## References
- [GitHub Advisory GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26)
# Security Policy

## Supported Versions
- Only the latest major version is actively supported.

## Reporting a Vulnerability
- Please report security issues privately via email to the maintainers.
- Do not open public issues for security vulnerabilities.

## Access Control
- All sensitive actions require code review and approval.
- Use branch protection rules on `main` and release branches.
- Enable required status checks for CI, lint/tests, and legal governance gates before merging.
- Use CODEOWNERS to enforce review from core maintainers.

## Backups
- All critical data and configuration should be backed up regularly.
- Use cloud provider backup solutions for production data.
- Store infrastructure and configuration as code in version control.

## Dependency Vulnerability Management
- Production dependencies must remain free of known vulnerabilities at moderate severity or higher.
- Use `pnpm run audit:prod` locally before opening a PR for dependency changes.
- CI enforces a blocking production-only audit gate and runs a non-blocking full dependency audit for visibility.
- Dev-only advisories are tracked and remediated when upstream tooling provides a safe upgrade path.
- A workflow (`.github/workflows/security-dev-audit-weekly.yml`) runs weekly and also on dependency-manifest PR/push changes, then maintains a single tracking issue (create/update/reopen on findings, auto-close when clear).

### Current Known Dev-Only Advisory (Tracked)
- `ajv` (`<8.18.0`) appears through the ESLint toolchain (`eslint` -> `ajv` 6.x).
- This does not affect runtime production code paths and is treated as a monitored dev-only risk until upstream migration.
- Re-evaluate on each ESLint major/minor upgrade and remove this exception once resolved upstream.

---

_Keep this policy up to date as security practices evolve._
