/* eslint-env jest */

import { getTimeRemaining, isShopItemExpired } from './shopTimerUtils';

interface TestItem {
  timer: string;
}

describe('shopTimerUtils', () => {
  it('returns expired=true for past timer', () => {
    const now = new Date('2026-02-14T12:00:00Z');
    const expiresAt = '2026-02-14T11:00:00Z';
    expect(getTimeRemaining(expiresAt, now)).toEqual({ expired: true, hours: 0, minutes: 0 });
  });

  it('returns correct hours and minutes for future timer', () => {
    const now = new Date('2026-02-14T10:00:00Z');
    const expiresAt = '2026-02-14T12:30:00Z';
    expect(getTimeRemaining(expiresAt, now)).toEqual({ expired: false, hours: 2, minutes: 30 });
  });

  it('isShopItemExpired returns true for expired item', () => {
    const now = new Date('2026-02-14T12:00:00Z');
    const item: TestItem = { timer: '2026-02-14T11:00:00Z' };
    expect(isShopItemExpired(item, now)).toBe(true);
  });

  it('isShopItemExpired returns false for active item', () => {
    const now = new Date('2026-02-14T10:00:00Z');
    const item: TestItem = { timer: '2026-02-14T11:00:00Z' };
    expect(isShopItemExpired(item, now)).toBe(false);
  });
});
