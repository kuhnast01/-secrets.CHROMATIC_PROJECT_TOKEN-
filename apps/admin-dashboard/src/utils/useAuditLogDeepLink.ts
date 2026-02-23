import { useEffect } from 'react';

export function useAuditLogDeepLink(onDeepLink: (entryId: string) => void) {
  useEffect(() => {
    // Listen for deep link events (e.g., from audit log UI)
    // Example: window.addEventListener('auditLogDeepLink', ...)
    // Call onDeepLink(entryId) when triggered
    // Cleanup listener on unmount
    return () => {};
  }, [onDeepLink]);
}
