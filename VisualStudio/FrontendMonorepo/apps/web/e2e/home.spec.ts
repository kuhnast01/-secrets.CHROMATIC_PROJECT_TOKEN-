import { test, expect } from '@playwright/test';

test('Web App E2E - Home loads', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.locator('body')).toBeVisible();
  await expect(page).toHaveTitle(/Poseidon|Web|Home/i);
});
