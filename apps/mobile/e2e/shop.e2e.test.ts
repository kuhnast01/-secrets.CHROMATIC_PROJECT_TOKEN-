/* eslint-env jest */
import { device, expect, element, by } from 'detox';

describe('ShopScreen E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should display the shop header', async () => {
    await expect(element(by.text('Shop'))).toBeVisible();
  });

  it('should switch tabs and show tab content', async () => {
    await element(by.text('Seasonal')).tap();
    await expect(element(by.text('Seasonal'))).toBeVisible();
  });

  it('should open and close onboarding modal', async () => {
    await expect(element(by.text('Welcome to the Shop!'))).toBeVisible();
    await element(by.text('Get Started')).tap();
    await expect(element(by.text('Welcome to the Shop!'))).toBeNotVisible();
  });

  it('should open and close invite friend modal', async () => {
    await element(by.label('Invite a new friend')).tap();
    await expect(element(by.text('Invite a Friend'))).toBeVisible();
    await element(by.text('Close')).tap();
    await expect(element(by.text('Invite a Friend'))).toBeNotVisible();
  });

  it('should open and close chat modal', async () => {
    await element(by.label('Open chat with friends')).tap();
    await expect(element(by.text('Friend Chat'))).toBeVisible();
    await element(by.text('Close')).tap();
    await expect(element(by.text('Friend Chat'))).toBeNotVisible();
  });
});
