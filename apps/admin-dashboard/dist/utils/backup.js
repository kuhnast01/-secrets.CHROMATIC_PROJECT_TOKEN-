"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerBackup = triggerBackup;
exports.restoreBackup = restoreBackup;
// backup.ts - Automated backup and restore utilities (scaffold)
function triggerBackup() {
    return fetch('/api/backup', { method: 'POST' });
}
function restoreBackup(backupId) {
    return fetch(`/api/backup/${backupId}/restore`, { method: 'POST' });
}
