"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.focusFirstError = focusFirstError;
exports.announce = announce;
// a11y.ts - Accessibility helpers (scaffold)
function focusFirstError() {
    const errorEl = document.querySelector('[aria-invalid="true"]');
    if (errorEl)
        errorEl.focus();
}
function announce(message) {
    const live = document.getElementById('a11y-live');
    if (live)
        live.textContent = message;
}
