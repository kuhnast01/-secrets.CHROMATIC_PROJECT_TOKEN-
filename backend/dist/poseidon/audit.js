"use strict";
// Sprint 7: Security, Audit, and Compliance for Poseidon
// Adds audit logging, access control, and compliance helpers.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogger = void 0;
exports.canPerformAction = canPerformAction;
class AuditLogger {
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
exports.AuditLogger = AuditLogger;
function canPerformAction(user, action) {
    const rolePermissions = {
        admin: ['plan', 'step', 'feedback', 'error', 'access'],
        engineer: ['plan', 'step', 'feedback', 'error'],
        auditor: ['feedback', 'error', 'access'],
        guest: [],
    };
    return rolePermissions[user.role].includes(action);
}
