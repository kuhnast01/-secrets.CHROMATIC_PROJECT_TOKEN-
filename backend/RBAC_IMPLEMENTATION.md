# Poseidon RBAC Schema & Middleware

## Roles

- superadmin: Full access to all admin features and settings
- admin: Manage users, view logs, manage feature flags, but limited system settings
- support: Read-only access to most admin data, limited actions
- read-only: View-only access to admin dashboard

## Prisma Schema Example (backend/prisma/schema.prisma)

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role     @default(USER)
  // ...existing fields...
}

enum Role {
  USER
  ADMIN
  SUPERADMIN
  SUPPORT
  READONLY
}

## Express Middleware (backend/src/middleware/rbac.ts)

- Middleware to check user role and permissions for each admin route.
- Example usage:

```ts
import { Request, Response, NextFunction } from 'express';

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Assume user is attached to req
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
```

## Usage in Routes
```ts
import { requireRole } from './middleware/rbac';

router.get('/admin/users', requireRole(['ADMIN', 'SUPERADMIN']), getUsers);
```

## Next Steps
- Update Prisma schema and migrate DB.
- Implement RBAC middleware and apply to admin routes.
- Add backend admin pages to existing admin-dashboard/admin-panel.
- Document endpoints and permissions.
