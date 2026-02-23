import { useState } from 'react';
import { apiRequest } from '../api';

export function useAdminAutomation(scope: string) {
  const [dryRunResult, setDryRunResult] = useState<any>(null);
  const [dryRunOpen, setDryRunOpen] = useState(false);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [auditOpen, setAuditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDryRun = async (action: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest(`/admin/${scope}/dry-run`, { method: 'POST', body: JSON.stringify({ action, ...data }) });
      setDryRunResult(result);
      setDryRunOpen(true);
    } catch (e: any) {
      setError(e.message);
      setDryRunResult({ error: e.message });
      setDryRunOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAuditLog = async () => {
    setLoading(true);
    setError(null);
    try {
      const logs = await apiRequest(`/admin/audit-log?scope=${scope}`);
      setAuditLog(logs);
      setAuditOpen(true);
    } catch (e: any) {
      setError(e.message);
      setAuditLog([{ message: e.message, timestamp: new Date().toISOString() }]);
      setAuditOpen(true);
    } finally {
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
