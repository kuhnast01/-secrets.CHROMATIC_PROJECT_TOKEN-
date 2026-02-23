# Admin Automation Testing & Troubleshooting

## Test Coverage
- Playwright battery tests cover all major admin pages (Users, Events, Analytics, Shop, Promotions, SystemSettings).
- Each test verifies:
  - Dry-run dialog opens and displays results
  - Audit log dialog opens and displays entries
  - Controls are visible only to authenticated admins

## Stress Testing
- Run battery tests in parallel with large datasets (e.g., 1000+ users/events) to ensure UI and backend stability.
- Monitor for:
  - UI responsiveness
  - API error handling
  - Audit log completeness
  - No memory leaks or crashes

## Maintenance & Troubleshooting
- All admin automation controls are documented with inline tooltips and integration doc links.
- For issues:
  - Check audit log dialog for recent admin actions
  - Review ADMIN_UI_BACKEND_INTEGRATION.md for integration patterns
  - Use Playwright test output for reproducible bug reports
- For maintainers:
  - Update tests and docs when adding new admin automation endpoints or UI flows
  - Keep automation hooks/components DRY and modular

## Data for Maintenance
- Audit logs are accessible from every admin page for traceability
- All dry-run actions are logged for review
- Integration docs are linked in the UI for quick reference

---

For further troubleshooting, see:
- `ADMIN_UI_BACKEND_INTEGRATION.md`
- `tests/admin-automation-battery.spec.ts`
- Inline help tooltips in the UI
