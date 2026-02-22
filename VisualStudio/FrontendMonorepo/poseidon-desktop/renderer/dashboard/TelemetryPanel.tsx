import React, { useEffect, useState } from 'react';

// Example metric type, adjust as needed
export type TelemetryMetric = {
  name: string;
  value: number;
  timestamp: string;
};

export default function TelemetryPanel() {
  const [metrics, setMetrics] = useState<TelemetryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:4000/telemetry', { credentials: 'include' })
      .then(r => r.json())
      .then(setMetrics)
      .catch(() => setError('Failed to fetch telemetry metrics'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="poseidon-container">
      <h2>Telemetry Metrics</h2>
      <div className="poseidon-card">
        {loading && <p>Loading telemetry metrics...</p>}
        {error && <p className="text-error">{error}</p>}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Value</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => (
                <tr key={i}>
                  <td style={{ padding: 8 }}>{m.name}</td>
                  <td style={{ padding: 8 }}>{m.value}</td>
                  <td style={{ padding: 8 }}>{new Date(m.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {metrics.length === 0 && !loading && !error && (
                <tr><td colSpan={3} className="text-muted" style={{ padding: 12 }}>No telemetry metrics found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
