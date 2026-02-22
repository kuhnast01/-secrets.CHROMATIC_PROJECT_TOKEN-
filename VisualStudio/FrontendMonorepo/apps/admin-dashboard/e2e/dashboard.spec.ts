import { test, expect } from '@playwright/test';

test('Admin Dashboard E2E - Dashboard loads', async ({ page }) => {
  await page.goto('http://localhost:5173/dashboard');
  await expect(page.locator('body')).toBeVisible();
  await expect(page).toHaveTitle(/Admin|Dashboard/i);
});
