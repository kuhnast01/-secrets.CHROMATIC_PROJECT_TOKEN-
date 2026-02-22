// bulkActions.ts - Bulk actions utility (scaffold)
export function bulkDelete(resource: string, ids: string[]) {
  return fetch(`/api/${resource}/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
}

export function bulkUpdate(resource: string, ids: string[], data: any) {
  return fetch(`/api/${resource}/bulk-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, data }),
  });
}
