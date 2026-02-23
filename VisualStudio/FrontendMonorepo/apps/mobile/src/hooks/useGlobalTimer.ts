import { useEffect, useState } from 'react';

// Returns a Date object updated every intervalMs (default 60s)
export function useGlobalNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => { setNow(new Date()); }, intervalMs);
    return () => { clearInterval(interval); };
  }, [intervalMs]);
  return now;
}

// Returns a structured time remaining object for i18n/locale-aware formatting
export function useTimeRemaining(expiresAt, now) {
  if (!expiresAt) return { expired: false, hours: 0, minutes: 0, isExpired: false };
  const end = new Date(expiresAt);
  const diff = Math.max(0, end.getTime() - now.getTime());
  if (diff <= 0) return { expired: true, hours: 0, minutes: 0, isExpired: true };
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { expired: false, hours, minutes, isExpired: false };
}
