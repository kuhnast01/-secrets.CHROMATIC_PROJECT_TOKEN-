// Sprint 7: Security, Audit, and Compliance for Poseidon
// Adds audit logging, access control, and compliance helpers.
export class AuditLogger {
    constructor() {
        this.logs = [];
    }
    log(entry) {
        this.logs.push(entry);
    }
    getLogsByUser(user) {
        return this.logs.filter(l => l.user === user);
    }
    getLogsByAction(actionType) {
        return this.logs.filter(l => l.actionType === actionType);
    }
    getAllLogs() {
        return [...this.logs];
    }
}
export function canPerformAction(user, action) {
    const rolePermissions = {
        admin: ['plan', 'step', 'feedback', 'error', 'access'],
        engineer: ['plan', 'step', 'feedback', 'error'],
        auditor: ['feedback', 'error', 'access'],
        guest: [],
    };
    return rolePermissions[user.role].includes(action);
}
