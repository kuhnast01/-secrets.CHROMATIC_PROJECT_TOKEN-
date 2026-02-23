"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDelete = bulkDelete;
exports.bulkUpdate = bulkUpdate;
// bulkActions.ts - Bulk actions utility (scaffold)
function bulkDelete(resource, ids) {
    return fetch(`/api/${resource}/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
    });
}
function bulkUpdate(resource, ids, data) {
    return fetch(`/api/${resource}/bulk-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, data }),
    });
}
