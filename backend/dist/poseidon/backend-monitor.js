"use strict";
// Phase 2 Pillar 3: Backend + Monitoring Integration for Poseidon
// Provides log ingestion, error classification, incident summarization, and patch suggestion.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendMonitor = void 0;
class BackendMonitor {
    constructor() {
        this.logs = [];
    }
    ingestLog(entry) {
        this.logs.push(entry);
    }
    classifyErrors() {
        const errors = this.logs.filter(l => l.level === 'error');
        return { errorCount: errors.length, errors };
    }
    summarizeIncidents() {
        const errors = this.logs.filter(l => l.level === 'error');
        if (errors.length === 0)
            return 'No incidents.';
        return `Incidents: ${errors.length} errors. Latest: ${errors[errors.length - 1].message}`;
    }
    suggestPatch() {
        // Stub: In real use, analyze logs and suggest code/infra patches
        if (this.logs.some(l => l.level === 'error'))
            return 'Patch required: investigate errors.';
        return 'No patch needed.';
    }
}
exports.BackendMonitor = BackendMonitor;
