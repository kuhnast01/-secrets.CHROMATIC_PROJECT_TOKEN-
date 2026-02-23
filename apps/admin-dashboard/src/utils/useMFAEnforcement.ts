import { useEffect } from 'react';

export function useMFAEnforcement(isSensitiveAction: boolean, onRequireMFA: () => void) {
  useEffect(() => {
    if (isSensitiveAction) {
      // Placeholder: trigger MFA modal or redirect
      onRequireMFA();
    }
  }, [isSensitiveAction, onRequireMFA]);
}
