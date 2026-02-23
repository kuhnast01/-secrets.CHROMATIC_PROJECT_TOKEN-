// backup.ts - Automated backup and restore utilities (scaffold)
export function triggerBackup() {
  return fetch('/api/backup', { method: 'POST' });
}

export function restoreBackup(backupId: string) {
  return fetch(`/api/backup/${backupId}/restore`, { method: 'POST' });
}
