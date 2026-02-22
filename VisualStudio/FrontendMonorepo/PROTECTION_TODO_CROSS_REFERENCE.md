# Poseidon Protection TODO Cross-Reference

Date: 2026-02-18

This document maps the founder protection checklist (Legal, Technical, Operational, Business) to current repository evidence.

Status legend:
- `Have` = implemented and evidenced in repo
- `Partial` = foundations exist but not fully enterprise-complete
- `Gap` = not present or not verifiable from repo artifacts

## 1) Legal Protection

| Control | Status | Evidence | Gap / Risk | Next action |
| --- | --- | --- | --- | --- |
| Copyright baseline | Have | Codebase ownership and authored materials across repo | Formal registration not tracked here | Decide jurisdictional registration strategy with counsel |
| Licensing agreement terms (no redistribution, no reverse engineering, no sublicensing, derivative restrictions, audit + termination rights) | Partial | [backend/ENTERPRISE_LICENSING.md](backend/ENTERPRISE_LICENSING.md), [legal/MSA_TEMPLATE.md](legal/MSA_TEMPLATE.md), [legal/EULA_TEMPLATE.md](legal/EULA_TEMPLATE.md), [legal/COUNSEL_REVIEW_CHECKLIST.md](legal/COUNSEL_REVIEW_CHECKLIST.md), [legal/VERSIONING_POLICY.md](legal/VERSIONING_POLICY.md) | Counsel execution and jurisdiction finalization still pending | Counsel redline + approve enforceable production versions |
| NDA coverage | Partial | [legal/NDA_TEMPLATE.md](legal/NDA_TEMPLATE.md), [legal/NDA_EXECUTION_RUNBOOK.md](legal/NDA_EXECUTION_RUNBOOK.md) | Not yet executed per-counterparty | Integrate e-sign workflow and execution tracking |
| Trademark protection workflow | Partial | [legal/TRADEMARK_TRACKER.md](legal/TRADEMARK_TRACKER.md) | Filing not started | Run clearance + file with counsel in priority jurisdictions |

## 2) Technical Protection

| Control | Status | Evidence | Gap / Risk | Next action |
| --- | --- | --- | --- | --- |
| Source code private / limited disclosure model | Partial | Distribution controls discussed in docs; backend governance hardening present | Privacy posture is operational, not enforceable by repo alone | Add distribution policy: source-access tiers + approval workflow |
| Binary distribution model | Partial | Desktop packaging via [apps/poseidon-ui/package.json](apps/poseidon-ui/package.json) (`build:package`), release workflow [\.github/workflows/release-distribution-provenance.yml](.github/workflows/release-distribution-provenance.yml), provenance generator [scripts/release/generate-provenance-manifest.mjs](scripts/release/generate-provenance-manifest.mjs), and operator setup guide [GOVERNANCE_OPERATOR_RUNBOOK.md](GOVERNANCE_OPERATOR_RUNBOOK.md) | Signing-key rollout, immutable publication targets, and production release approval operations are still maturing | Wire key management + publication registry + periodic release-gate audit evidence |
| Obfuscation strategy | Gap | No JS obfuscation pipeline found | Reverse engineering effort remains moderate | Evaluate scoped obfuscation for desktop/admin builds |
| API-only interaction boundary | Partial | Backend API and middleware architecture; licensing guard on routes in [backend/src/middleware/licenseGuard.ts](backend/src/middleware/licenseGuard.ts) | Some package-level cross-use patterns still evolving | Publish explicit client integration contract (API/Webhook only) |

## 3) Operational Protection

| Control | Status | Evidence | Gap / Risk | Next action |
| --- | --- | --- | --- | --- |
| Per-client licensing keys | Have | License generation/hash/revoke scripts in [backend/package.json](backend/package.json); enforcement in [backend/src/security/license.ts](backend/src/security/license.ts) | Client lifecycle automation can be expanded | Add customer license issuance SOP with approval chain |
| Revocation and severity response | Have | Runtime revocation and rotation endpoints in [backend/src/routes/license.ts](backend/src/routes/license.ts), runtime revocation store in [backend/src/security/licenseRevocations.ts](backend/src/security/licenseRevocations.ts), LIC-01 drill in [backend/scripts/liveops/run-license-revocation-rotation-drill.ts](backend/scripts/liveops/run-license-revocation-rotation-drill.ts), and CI evidence upload in [.github/workflows/ci.yml](.github/workflows/ci.yml) | Customer-level anomaly policy not fully defined | Add anomaly threshold playbook + severity escalation matrix |
| Usage monitoring and suspicious pattern tracking | Partial | Reliability/stress/report workflows and governance issue automation under [.github/workflows](.github/workflows) | Customer-level anomaly policy not fully defined | Add abuse/suspicious-pattern thresholds and escalation matrix |
| Encrypted configuration and signed builds | Partial | Security/governance docs and variable controls in [backend/SECURITY.md](backend/SECURITY.md) | End-to-end encrypted config + signing pipeline not complete | Add secrets-at-rest and signing runbook + CI enforcement |
| Controlled updates (publisher-controlled) | Partial | Governance workflows and change-control docs exist | Secure updater channel not implemented | Add update channel design doc + rollout controls |

## 4) Business Protection

| Control | Status | Evidence | Gap / Risk | Next action |
| --- | --- | --- | --- | --- |
| Proprietary architecture protection posture | Partial | Governance index and policy docs in [backend/README.md](backend/README.md) and [backend/SECURITY.md](backend/SECURITY.md) | Explicit IP exposure boundaries not centralized | Add IP boundary policy (what is never shared) |
| Selective licensing motion | Partial | Licensing controls and enterprise notes exist | Go-to-market licensing tiers/process not codified | Add licensing tiers + qualification playbook |
| Support-contract stickiness | Partial | Runbooks and operations docs are mature | Formal support/SLA package not authored | Add support plans + SLA draft in legal track |
| Reputation/brand strategy | Gap | No brand playbook/trademark execution artifact in repo | Defensibility and trust narratives remain ad hoc | Add brand trust + proof artifacts plan |

## Prioritized Gap Closure (Founder Order)

1. **Legal stack execution (highest risk):** counsel-redline templates and move to signature-ready production forms.
	- Release gate: [legal/LEGAL_RELEASE_BUNDLE_CHECKLIST.md](legal/LEGAL_RELEASE_BUNDLE_CHECKLIST.md)
2. **Distribution hardening:** signed binary release pipeline, immutable artifact retention, and update-channel policy.
3. **Operational hardening:** anomaly threshold playbook + customer abuse escalation matrix.
4. **IP/business moat docs:** IP boundary policy, licensing tiering, support/SLA packaging.

## Cross-reference to existing founder backlog

- Existing founder backlog: [POSEIDON_ELITE_TODO.md](POSEIDON_ELITE_TODO.md)
- Enterprise licensing controls: [backend/ENTERPRISE_LICENSING.md](backend/ENTERPRISE_LICENSING.md)
- Governance runbooks: [backend/DOCUMENTATION_RUNBOOKS.md](backend/DOCUMENTATION_RUNBOOKS.md)
- Security policy: [backend/SECURITY.md](backend/SECURITY.md)
