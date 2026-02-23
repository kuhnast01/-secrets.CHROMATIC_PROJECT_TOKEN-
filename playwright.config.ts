// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './apps/admin-dashboard/tests',
  timeout: 30 * 1000,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
    trace: 'on-first-retry',
  },
});
