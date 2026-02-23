# Centralized Admin Portal & RBAC (Poseidon)

## Vision
A unified admin portal for managing users, roles, logs, analytics, feature flags, and system health across all services. Includes robust Role-Based Access Control (RBAC).

## Implementation Plan

### 1. Centralized Admin Portal

- Option 1: Extend existing admin-dashboard/admin-panel to aggregate backend (Poseidon) admin features.
- Option 2: Create a new lightweight web app (e.g., Next.js, Vite, or Express + React) in /apps or /admin for backend admin tasks.
- Features: User management, logs, analytics, feature flags, health checks, job queue, config.

### 2. RBAC

- Define roles (e.g., superadmin, admin, support, read-only).
- Enforce permissions in backend routes/controllers (see /backend/src/controllers/ and /middleware/).
- Store roles/permissions in DB (see /backend/prisma/schema.prisma).
- Add RBAC middleware to Express (see /backend/src/middleware/).

### 3. API Endpoints

- Expose secure endpoints for admin actions (protected by RBAC).
- Document endpoints in Swagger/OpenAPI (see /backend/src/swagger.ts).

### 4. Security

- Require strong authentication (consider SSO, 2FA for admin users).
- Log all admin actions (see audit logging pillar).

---

## Next Steps
- Decide: Extend existing admin app or create new one?
- Design RBAC schema and middleware.
- Implement admin endpoints and UI.
- Update documentation and onboarding.
