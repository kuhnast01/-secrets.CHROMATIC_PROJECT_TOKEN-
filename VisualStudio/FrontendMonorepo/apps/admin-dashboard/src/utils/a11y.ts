// a11y.ts - Accessibility helpers (scaffold)
export function focusFirstError() {
  const errorEl = document.querySelector('[aria-invalid="true"]');
  if (errorEl) (errorEl as HTMLElement).focus();
}

export function announce(message: string) {
  const live = document.getElementById('a11y-live');
  if (live) live.textContent = message;
}
