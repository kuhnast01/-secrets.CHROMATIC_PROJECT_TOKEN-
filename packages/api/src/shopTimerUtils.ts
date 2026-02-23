// shopTimerUtils.ts
// Pure utility functions for shop timer logic (unit testable)

export function getTimeRemaining(expiresAt: string, now: Date = new Date()): { expired: boolean; hours: number; minutes: number } {
  const end = new Date(expiresAt);
  const diff = Math.max(0, end.getTime() - now.getTime());
  if (diff <= 0) {
    return { expired: true, hours: 0, minutes: 0 };
  }
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { expired: false, hours, minutes };
}

export function isShopItemExpired(item: { timer?: string; available?: boolean }, now: Date = new Date()): boolean {
  if (!item.timer) return false;
  return getTimeRemaining(item.timer, now).expired;
}
