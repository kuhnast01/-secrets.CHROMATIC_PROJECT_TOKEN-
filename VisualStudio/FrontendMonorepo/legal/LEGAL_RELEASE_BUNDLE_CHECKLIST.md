# Legal Release Bundle Checklist

Purpose: define what constitutes a shippable, customer-ready legal pack for Poseidon licensing.

## Bundle identity
- Bundle ID: `LEGAL-BUNDLE-<YYYYMMDD>-<version>`
- Version: `X.Y.Z` (aligned with `VERSIONING_POLICY.md`)
- Owner: Poseidon Engine
- Counsel signoff date (UTC):
- Effective date (UTC):

## Required documents
- [ ] MSA (approved version)
- [ ] SLA (approved version)
- [ ] DPA (approved version, when data processing applies)
- [ ] EULA (approved version)
- [ ] NDA (approved version)

## Required metadata and traceability
- [x] Each template contains header metadata (ID, version, status, owner, last updated)
- [x] `LEGAL_CHANGELOG.md` updated with this release
- [ ] Version tag prepared (`legal-vX.Y.Z`)
- [ ] Jurisdiction and governing law choices finalized for this release
- [x] Approval record created from `APPROVAL_RECORD_TEMPLATE.md` and archived

## Risk and enforcement checks
- [ ] License restrictions validated (no redistribution, no reverse engineering, no sublicensing, derivative constraints)
- [ ] Audit rights and termination clauses reviewed
- [ ] Liability cap and carve-outs approved by counsel
- [ ] Data processing obligations and breach notice windows confirmed

## Operational readiness checks
- [ ] NDA execution workflow ready for counterparties
- [ ] Signature workflow selected (approved e-sign platform)
- [ ] Contract repository/archive location defined
- [ ] Access control policy enforces “no access before executed NDA”

## Release approval
- Legal owner:
- Counsel approver:
- Founder approver:
- Approval date (UTC):

## Current release progress note (2026-02-18)
- Metadata headers, changelog linkage, and approval record baselines are complete.
- Remaining go-live legal gates are counsel assignment, jurisdiction finalization, and commercial execution signoff.

## Post-release actions
- [ ] Publish internal release note for sales/onboarding teams
- [ ] Update customer onboarding runbook with current legal bundle ID
- [ ] Schedule next legal review checkpoint
