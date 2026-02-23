# Admin UI/Backend Integration Pattern

This document describes the professional, best-practice pattern for integrating backend admin automation (dry-run, override, audit log) with the React admin dashboard UI.

## 1. Global Admin Session Context
- Use `AdminSessionContext` to provide authentication/session state and logout functionality to all components.
- Wrap your app in `<AdminSessionProvider>` in `App.tsx`.

## 2. Secure API Utility
- Use the centralized `apiRequest` utility to automatically attach the admin token to all backend requests.
- All admin-only endpoints are protected and require a valid token.

## 3. UI Integration Example (Shop Page)
- Add UI controls for admin automation (e.g., dry-run, override, audit log summary) only if the admin is authenticated.
- Use dialogs to display dry-run results and audit log summaries for transparency and troubleshooting.
- Example pattern:
  ```tsx
  // In your page/component
  const { isAuthenticated } = useAdminSession();
  // ...
  {isAuthenticated && (
    <>
      <Button onClick={handleDryRun}>Dry-Run Bulk Delete</Button>
      <Button onClick={handleAuditLog}>View Audit Log</Button>
    </>
  )}
  ```

## 4. Backend Endpoint Usage
- Dry-run: POST `/admin/shop/dry-run` with action and IDs, display result in dialog.
- Audit log: GET `/admin/audit-log?scope=shop`, display summary in dialog.

## 5. Logout and Session Security
- Use the global logout button in the Layout/AppBar for secure session termination.
- Session state is automatically updated across tabs/windows.

## 6. Documentation and Maintenance
- Document all integration points and patterns in this file for future maintainers.
- Ensure all admin actions are auditable and self-documenting via the audit log dialog.

---

For further troubleshooting and automation details, see `DOCS_AUTOMATION.md` and `admin-maintenance-tools.md` in the backend.
