# Legal Release Record Retention Policy

Purpose: define naming, retention, and edit controls for `legal/releases/` approval artifacts.

## Naming convention
- Required file format: `LEGAL-BUNDLE-YYYYMMDD-X.Y.Z.md`
- Example: `LEGAL-BUNDLE-20260218-0.1.0.md`
- `YYYYMMDD` is the approval date in UTC.
- `X.Y.Z` must align with legal template versioning rules in `../VERSIONING_POLICY.md`.

## Minimum record contents
Each release record must include:
- Bundle ID and version
- Effective date and scope
- Included legal document versions
- Legal owner/counsel/founder approval fields
- Evidence links (changelog, PRs, archive path)
- Next review date and open follow-ups

## Retention and archival
- Keep all release records for a minimum of **7 years** from effective date.
- Keep records in repository history and in an immutable external archive location (document path in each record).
- Do not delete prior release records unless required by law; if deletion is required, document legal basis and approving authority.

## Immutability and amendments
- Historical release records are treated as immutable evidence.
- Corrections must be appended via:
  1. A clearly dated amendment section in the existing record, or
  2. A superseding release record with cross-reference to the prior record.
- Never overwrite prior approval facts without an amendment trail.

## Edit authority
- Changes to `legal/releases/` require CODEOWNERS review by Poseidon Engine owner(s).
- Only legal owner/delegate may approve amendments to historical records.
