"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdminAutomation = useAdminAutomation;
const react_1 = require("react");
const api_1 = require("../api");
function useAdminAutomation(scope) {
    const [dryRunResult, setDryRunResult] = (0, react_1.useState)(null);
    const [dryRunOpen, setDryRunOpen] = (0, react_1.useState)(false);
    const [auditLog, setAuditLog] = (0, react_1.useState)([]);
    const [auditOpen, setAuditOpen] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const handleDryRun = async (action, data) => {
        setLoading(true);
        setError(null);
        try {
            const result = await (0, api_1.apiRequest)(`/admin/${scope}/dry-run`, { method: 'POST', body: JSON.stringify({ action, ...data }) });
            setDryRunResult(result);
            setDryRunOpen(true);
        }
        catch (e) {
            setError(e.message);
            setDryRunResult({ error: e.message });
            setDryRunOpen(true);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAuditLog = async () => {
        setLoading(true);
        setError(null);
        try {
            const logs = await (0, api_1.apiRequest)(`/admin/audit-log?scope=${scope}`);
            setAuditLog(logs);
            setAuditOpen(true);
        }
        catch (e) {
            setError(e.message);
            setAuditLog([{ message: e.message, timestamp: new Date().toISOString() }]);
            setAuditOpen(true);
        }
        finally {
            setLoading(false);
        }
    };
    return {
        dryRunResult,
        dryRunOpen,
        setDryRunOpen,
        auditLog,
        auditOpen,
        setAuditOpen,
        loading,
        error,
        handleDryRun,
        handleAuditLog,
    };
}
