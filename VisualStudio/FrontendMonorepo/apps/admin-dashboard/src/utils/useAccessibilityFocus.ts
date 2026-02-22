import { useEffect } from 'react';

export function useAccessibilityFocus(ref: React.RefObject<HTMLElement>, open: boolean) {
  useEffect(() => {
    if (open && ref.current) {
      ref.current.focus();
    }
  }, [open, ref]);
}
