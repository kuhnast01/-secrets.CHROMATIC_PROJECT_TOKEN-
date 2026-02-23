# Legal Template Versioning Policy

Purpose: keep legal templates governed with the same rigor as code changes.

## Scope
- `MSA_TEMPLATE.md`
- `SLA_TEMPLATE.md`
- `DPA_TEMPLATE.md`
- `EULA_TEMPLATE.md`
- `NDA_TEMPLATE.md`
- Related process docs in `legal/`

## Required metadata in each template
- Template ID
- Version
- Status (`Draft`, `Counsel Review`, `Approved`, `Deprecated`)
- Last updated date (UTC)
- Owner
- Counsel review required flag

## Versioning rules
- Patch (`x.y.Z`): typo/format clarifications with no legal meaning change.
- Minor (`x.Y.z`): additive clauses, optional terms, or process clarifications.
- Major (`X.y.z`): changes to risk allocation, liability, IP, confidentiality, termination, or data obligations.

## Change control
1. Open a PR with rationale and risk summary.
2. Update template metadata and `LEGAL_CHANGELOG.md`.
3. Link counsel review status in PR description.
4. Do not mark template `Approved` until counsel signoff is recorded.

## Release tags (recommended)
- Tag legal baseline snapshots as `legal-vX.Y.Z` when a deployable legal pack is ready.
- Keep a signed-off artifact bundle for each customer-facing legal release.
- Apply retention and amendment controls from `releases/RETENTION_POLICY.md`.
