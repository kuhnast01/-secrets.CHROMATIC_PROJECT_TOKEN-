


import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type DAUMAUPoint = { month: string; DAU: number; MAU: number };
type AuditLog = {
  id: number;
  timestamp: string;
  actor_type: string;
  actor_id: number | null;
  action: string;
  target_type: string;
  target_id: number | null;
  ip_address: string | null;
  user_agent: string | null;
};

export default function Analytics() {
  const [dauMau, setDauMau] = useState<DAUMAUPoint[]>([]);
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('http://localhost:4000/analytics/dau-mau', { credentials: 'include' }).then(r => r.json()),
      fetch('http://localhost:4000/audit', { credentials: 'include' }).then(r => r.json()),
    ])
      .then(([dauMauData, auditData]) => {
        setDauMau(dauMauData);
        setAudit(auditData);
      })
      .catch(e => setError('Failed to fetch analytics data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="poseidon-container">
      <h2>Analytics & KPIs</h2>
      <div className="poseidon-card" style={{ width: '100%', height: 320 }}>
        <h3 style={{ marginTop: 0 }}>DAU vs MAU</h3>
        {loading ? (
          <p>Loading DAU/MAU data...</p>
        ) : error ? (
          <p className="text-error">{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dauMau} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="DAU" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="MAU" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="poseidon-card" style={{ marginTop: 32 }}>
        <h3 style={{ marginTop: 0 }}>Recent Audit Events</h3>
        {loading && <p>Loading audit logs...</p>}
        {error && <p className="text-error">{error}</p>}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Time</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Actor</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Action</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Target</th>
                <th style={{ textAlign: 'left', padding: 8 }}>IP</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((log, i) => (
                <tr key={log.id}>
                  <td style={{ padding: 8, color: 'var(--color-muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                  <td style={{ padding: 8 }}>{log.actor_type}{log.actor_id ? ` #${log.actor_id}` : ''}</td>
                  <td style={{ padding: 8 }}>{log.action}</td>
                  <td style={{ padding: 8 }}>{log.target_type}{log.target_id ? ` #${log.target_id}` : ''}</td>
                  <td style={{ padding: 8 }}>{log.ip_address || ''}</td>
                </tr>
              ))}
              {audit.length === 0 && !loading && !error && (
                <tr><td colSpan={5} className="text-muted" style={{ padding: 12 }}>No recent audit events.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type AuditLog = {
  id: number;
  timestamp: string;
  actor_type: string;
  actor_id: number | null;
  action: string;
  target_type: string;
  target_id: number | null;
  ip_address: string | null;
  user_agent: string | null;
};

export default function Analytics() {
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:4000/audit', { credentials: 'include' })
      .then(r => r.json())
      .then(setAudit)
      .catch(e => setError('Failed to fetch audit logs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="poseidon-container">
      <h2>Analytics & KPIs</h2>
      <div className="poseidon-card" style={{ width: '100%', height: 320 }}>
        <h3 style={{ marginTop: 0 }}>DAU vs MAU</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="DAU" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="MAU" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="poseidon-card" style={{ marginTop: 32 }}>
        <h3 style={{ marginTop: 0 }}>Recent Audit Events</h3>
        {loading && <p>Loading audit logs...</p>}
        {error && <p className="text-error">{error}</p>}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Time</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Actor</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Action</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Target</th>
                <th style={{ textAlign: 'left', padding: 8 }}>IP</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((log, i) => (
                <tr key={log.id}>
                  <td style={{ padding: 8, color: 'var(--color-muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                  <td style={{ padding: 8 }}>{log.actor_type}{log.actor_id ? ` #${log.actor_id}` : ''}</td>
                  <td style={{ padding: 8 }}>{log.action}</td>
                  <td style={{ padding: 8 }}>{log.target_type}{log.target_id ? ` #${log.target_id}` : ''}</td>
                  <td style={{ padding: 8 }}>{log.ip_address || ''}</td>
                </tr>
              ))}
              {audit.length === 0 && !loading && !error && (
                <tr><td colSpan={5} className="text-muted" style={{ padding: 12 }}>No recent audit events.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
