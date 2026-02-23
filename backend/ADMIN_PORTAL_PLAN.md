
# Poseidon Admin Portal: Implementation Plan

## Option 1: Extend Existing Admin App

- Integrate Poseidon backend admin features into the current admin-dashboard or admin-panel frontend app.
- Add new pages/components for backend-specific admin tasks (user management, logs, feature flags, health checks).
- Use existing authentication and RBAC patterns.

## Option 2: New Lightweight Admin App

- Scaffold a new app (e.g., Next.js or Vite + React) in /apps/poseidon-admin or /admin.
- Minimal UI focused on backend admin needs.
- Connect to Poseidon backend via secure API endpoints.

## RBAC Implementation

- Define roles: superadmin, admin, support, read-only.
- Add roles/permissions to user model in Prisma schema.
- Implement RBAC middleware in Express (backend/src/middleware/).
- Enforce permissions on all admin endpoints.

## Next Steps

1. Decide: Extend existing admin app or create new one.
2. Design RBAC schema and update database.
3. Implement RBAC middleware and secure endpoints.
4. Build or extend admin UI.
5. Update documentation and onboarding.

---

## Action Required

- Please confirm if you want to extend an existing admin app or create a new dedicated Poseidon admin app.
