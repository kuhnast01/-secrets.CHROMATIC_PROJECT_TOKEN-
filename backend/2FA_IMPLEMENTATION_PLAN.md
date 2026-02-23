# 2FA/MFA for Admin Users (Poseidon)

## Why
Two-factor authentication (2FA) is required for all users with admin or higher roles to prevent unauthorized access, even if credentials are compromised.

## Implementation Plan

### 1. 2FA Enrollment

- On first login or in profile settings, prompt admin users to enroll in 2FA (TOTP app like Google Authenticator, or email/SMS code).
- Store 2FA secret (hashed/encrypted) in the user table.

### 2. 2FA Verification

- On login, after password is verified, require 2FA code for admin roles.
- Validate code using TOTP or code sent via email/SMS.

### 3. Backup Codes

- Generate backup codes for recovery.
- Allow admins to regenerate/revoke backup codes.

### 4. Enforcement

- Middleware to enforce 2FA for all admin endpoints.
- Block access if 2FA is not enabled or not verified in session.

### 5. UI

- Add 2FA setup and verification screens to admin-dashboard/admin-panel.
- Show 2FA status in user profile.

### 6. Documentation

- Update onboarding and security docs.

---

## Next Steps
- Add 2FA fields to user model (prisma/schema.prisma).
- Implement 2FA setup and verification endpoints.
- Add 2FA middleware to admin routes.
- Update admin UI for 2FA flows.
