import { test, expect } from '@playwright/test';

// Battery of admin automation tests for all major admin pages

test.describe('Admin Automation - Users', () => {
  test('Dry-run and audit log', async ({ page }) => {
    await page.goto('/users');
    await page.click('text=Dry-Run Bulk Delete');
    await expect(page.locator('text=Dry-Run Result')).toBeVisible();
    await page.click('button:has-text("Close")');
    await page.click('text=View Audit Log');
    await expect(page.locator('text=Users Audit Log Summary')).toBeVisible();
  });
});

test.describe('Admin Automation - Events', () => {
  test('Dry-run and audit log', async ({ page }) => {
    await page.goto('/events');
    await page.click('text=Dry-Run Bulk Delete');
    await expect(page.locator('text=Dry-Run Result')).toBeVisible();
    await page.click('button:has-text("Close")');
    await page.click('text=View Audit Log');
    await expect(page.locator('text=Events Audit Log Summary')).toBeVisible();
  });
});

test.describe('Admin Automation - Analytics', () => {
  test('Dry-run and audit log', async ({ page }) => {
    await page.goto('/analytics');
    await page.click('text=Dry-Run Analytics Reset');
    await expect(page.locator('text=Dry-Run Result')).toBeVisible();
    await page.click('button:has-text("Close")');
    await page.click('text=View Audit Log');
    await expect(page.locator('text=Analytics Audit Log Summary')).toBeVisible();
  });
});
