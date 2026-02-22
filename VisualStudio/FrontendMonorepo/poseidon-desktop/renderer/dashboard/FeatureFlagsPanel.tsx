import React, { useEffect, useState } from 'react';

type FeatureFlag = {
  id: number;
  name: string;
  enabled: boolean;
  target_segment?: string;
  experiment_id?: string;
};

export default function FeatureFlagsPanel() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:4000/feature-flags', { credentials: 'include' })
      .then(r => r.json())
      .then(setFlags)
      .catch(() => setError('Failed to fetch feature flags'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="poseidon-container">
      <h2>Feature Flags</h2>
      <div className="poseidon-card">
        {loading && <p>Loading feature flags...</p>}
        {error && <p className="text-error">{error}</p>}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Enabled</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Target Segment</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Experiment</th>
              </tr>
            </thead>
            <tbody>
              {flags.map(flag => (
                <tr key={flag.id}>
                  <td style={{ padding: 8 }}>{flag.name}</td>
                  <td style={{ padding: 8 }}>{flag.enabled ? 'Yes' : 'No'}</td>
                  <td style={{ padding: 8 }}>{flag.target_segment ?? '-'}</td>
                  <td style={{ padding: 8 }}>{flag.experiment_id ?? '-'}</td>
                </tr>
              ))}
              {flags.length === 0 && !loading && !error && (
                <tr><td colSpan={4} className="text-muted" style={{ padding: 12 }}>No feature flags found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
