import React, { useEffect, useState } from 'react';

type ServiceName = 'backend' | 'admin-panel' | 'web';

type ServiceStatusItem = {
  name: ServiceName;
  port: number;
  open: boolean;
  managed?: boolean;
  pid?: number | null;
};

type ObservabilitySnapshot = {
  status: string;
  timestamp: string;
  health?: { status?: string; error?: string };
  services: ServiceStatusItem[];
  alerts: { severity: 'high' | 'medium'; message: string }[];
  errorSnippets: string[];
};

type RunbookStep = {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'failed';
  result?: string;
  error?: string;
};

type IncidentRun = {
  runId: string;
  name: string;
  title: string;
  status: 'running' | 'completed' | 'failed';
  steps: RunbookStep[];
  timeline: string[];
};

type RunbookDefinition = {
  name: string;
  title: string;
  description: string;
  steps: { id: string; title: string }[];
};

export default function ServiceStatus() {
  const [snapshot, setSnapshot] = useState<ObservabilitySnapshot | null>(null);
  const [busyService, setBusyService] = useState<string | null>(null);
  const [runbooks, setRunbooks] = useState<RunbookDefinition[]>([]);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [activeRun, setActiveRun] = useState<IncidentRun | null>(null);
  const [runbookBusy, setRunbookBusy] = useState(false);

  const refreshRunbookStatus = async (runId: string) => {
    // @ts-ignore
    const result = await window.electronAPI?.invoke('tools:incidentRunbookStatus', runId);
    if (result?.status === 'ok') {
      setActiveRun(result.run);
    }
  };

  const loadRunbooks = async () => {
    // @ts-ignore
    const result = await window.electronAPI?.invoke('tools:incidentRunbookCatalog');
    if (result?.status === 'ok') {
      setRunbooks(result.runbooks ?? []);
    }
  };

  const startRunbook = async () => {
    if (runbooks.length === 0) {
      return;
    }
    setRunbookBusy(true);
    try {
      // @ts-ignore
      const result = await window.electronAPI?.invoke('tools:incidentRunbookStart', runbooks[0].name);
      if (result?.status === 'ok') {
        setActiveRunId(result.run.runId);
        setActiveRun(result.run);
      }
    } finally {
      setRunbookBusy(false);
    }
  };

  const executeNextRunbookStep = async () => {
    if (!activeRunId) {
      return;
    }
    setRunbookBusy(true);
    try {
      // @ts-ignore
      const result = await window.electronAPI?.invoke('tools:incidentRunbookExecuteNext', activeRunId);
      if (result?.run) {
        setActiveRun(result.run);
      }
      await refresh();
    } finally {
      setRunbookBusy(false);
    }
  };

  const refresh = async () => {
    // @ts-ignore
    const data = await window.electronAPI?.invoke('tools:observabilitySnapshot');
    if (data?.status === 'ok') {
      setSnapshot(data);
    }
  };

  const mutateService = async (action: 'tools:serviceStart' | 'tools:serviceStop' | 'tools:serviceRestart', service: ServiceName) => {
    setBusyService(service);
    try {
      // @ts-ignore
      await window.electronAPI?.invoke(action, service);
      await refresh();
    } finally {
      setBusyService(null);
    }
  };

  useEffect(() => {
    refresh();
    loadRunbooks();
    const interval = setInterval(() => {
      refresh();
      if (activeRunId) {
        refreshRunbookStatus(activeRunId);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeRunId]);

  const services = snapshot?.services ?? [];
  const alerts = snapshot?.alerts ?? [];

  return (
    <div style={{ background: '#f4f6fa', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3 style={{ margin: 0, fontSize: 16, color: '#1a2233' }}>Service Health & Observability</h3>
      <div style={{ marginTop: 8, marginBottom: 8, fontSize: 13, color: '#334155' }}>
        Backend health: <b>{snapshot?.health?.status ?? 'unknown'}</b>
        {snapshot?.timestamp ? ` • ${new Date(snapshot.timestamp).toLocaleTimeString()}` : ''}
      </div>

      {alerts.length > 0 ? (
        <div style={{ marginBottom: 12, background: '#fff7ed', border: '1px solid #fdba74', borderRadius: 6, padding: 10 }}>
          <b style={{ color: '#9a3412' }}>Alerts</b>
          <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
            {alerts.map((alert, index) => (
              <li key={`${alert.message}-${index}`} style={{ color: alert.severity === 'high' ? '#b91c1c' : '#c2410c', fontSize: 13 }}>
                {alert.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div style={{ marginBottom: 12, color: '#166534', fontSize: 13 }}>No active alerts</div>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {services.map(s => (
          <li key={s.name} style={{ margin: '8px 0', color: s.open ? '#16a34a' : '#dc2626', fontWeight: 600, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
            <div>
              {s.name} (port {s.port}): {s.open ? 'Running' : 'Not running'}
              {typeof s.managed === 'boolean' ? ` • managed: ${s.managed ? 'yes' : 'no'}` : ''}
              {s.pid ? ` • pid: ${s.pid}` : ''}
            </div>
            <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button disabled={busyService === s.name} onClick={() => mutateService('tools:serviceStart', s.name)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #94a3b8', cursor: 'pointer' }}>Start</button>
              <button disabled={busyService === s.name} onClick={() => mutateService('tools:serviceStop', s.name)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #94a3b8', cursor: 'pointer' }}>Stop</button>
              <button disabled={busyService === s.name} onClick={() => mutateService('tools:serviceRestart', s.name)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #94a3b8', cursor: 'pointer' }}>Restart</button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 12 }}>
        <b style={{ fontSize: 13, color: '#1e293b' }}>Recent error/warn snippets</b>
        <pre style={{ marginTop: 6, background: '#0f172a', color: '#e2e8f0', borderRadius: 6, padding: 8, fontSize: 12, maxHeight: 120, overflowY: 'auto' }}>
          {(snapshot?.errorSnippets ?? []).length > 0
            ? (snapshot?.errorSnippets ?? []).slice(-10).join('\n')
            : 'No recent error/warn snippets'}
        </pre>
      </div>

      <div style={{ marginTop: 16, borderTop: '1px solid #dbeafe', paddingTop: 12 }}>
        <b style={{ fontSize: 13, color: '#1e293b' }}>Incident Runbook Execution</b>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={startRunbook}
            disabled={runbookBusy || runbooks.length === 0 || (activeRun?.status === 'running')}
            style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #94a3b8', cursor: 'pointer' }}
          >
            Start Backend Outage Runbook
          </button>
          <button
            onClick={executeNextRunbookStep}
            disabled={runbookBusy || !activeRun || activeRun.status !== 'running'}
            style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #94a3b8', cursor: 'pointer' }}
          >
            Execute Next Step
          </button>
        </div>

        {activeRun ? (
          <div style={{ marginTop: 8, fontSize: 12, color: '#0f172a' }}>
            <div><b>Run ID:</b> {activeRun.runId}</div>
            <div><b>Status:</b> {activeRun.status}</div>
            <div style={{ marginTop: 6 }}>
              <b>Steps</b>
              <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                {activeRun.steps.map((step) => (
                  <li key={step.id} style={{ color: step.status === 'failed' ? '#b91c1c' : step.status === 'completed' ? '#166534' : '#334155' }}>
                    {step.title} — {step.status}
                    {step.result ? ` | ${step.result}` : ''}
                    {step.error ? ` | ${step.error}` : ''}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: 6 }}>
              <b>Timeline</b>
              <pre style={{ marginTop: 4, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 6, maxHeight: 120, overflowY: 'auto' }}>
                {(activeRun.timeline ?? []).slice(-12).join('\n')}
              </pre>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>No active runbook run yet.</div>
        )}
      </div>
    </div>
  );
}
