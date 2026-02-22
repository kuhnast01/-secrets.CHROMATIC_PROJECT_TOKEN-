# RBAC & Admin Flow Hardening Checklist

## Enforce Least Privilege

- Review all admin endpoints and restrict to minimum required roles.
- Regularly audit role assignments in the database.

## Add 2FA/MFA for Admins

- Require two-factor authentication for all users with admin or higher roles.
- Integrate with existing auth provider or use TOTP/email/SMS.

## Immutable Audit Logging

- Log all admin actions (who, what, when, where, why).
- Store logs in an immutable, tamper-evident store.
- Alert on suspicious or unauthorized admin activity.

## Session Management

- Shorter session expiry for admin users.
- Invalidate sessions on password/role change.
- Detect and block concurrent admin sessions if not needed.

## Secure Admin UI

- Hide admin UI routes/components for non-admins.
- Add confirmation dialogs for destructive actions.
- Require re-authentication for critical actions (e.g., user deletion).

## Defense in Depth

- Rate limit admin endpoints.
- Use CSRF protection for admin actions.
- Validate all input, even from admins.

## Regular Review

- Schedule periodic RBAC and admin flow reviews.
- Pen-test admin endpoints and flows.

---

## Next Steps

- Implement 2FA for admin users.
- Add immutable audit logging for all admin actions.
- Review and restrict all admin endpoints to least privilege.
- Harden admin UI with confirmation dialogs and re-authentication.
- Document and schedule regular reviews.
