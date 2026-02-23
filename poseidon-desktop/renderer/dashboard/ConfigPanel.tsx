import React, { useEffect, useState } from 'react';

type Config = {
  key: string;
  value: string;
  description?: string;
};

export default function ConfigPanel() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:4000/system-configs', { credentials: 'include' })
      .then(r => r.json())
      .then(setConfigs)
      .catch(() => setError('Failed to fetch configs'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = configs.filter(c => c.key.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="poseidon-container">
      <h2>System Configs</h2>
      <div className="poseidon-card">
        <input
          type="text"
          placeholder="Filter by key..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ marginBottom: 12, padding: 6, width: 220 }}
        />
        {loading && <p>Loading configs...</p>}
        {error && <p className="text-error">{error}</p>}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Key</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Value</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(config => (
                <tr key={config.key}>
                  <td style={{ padding: 8 }}>{config.key}</td>
                  <td style={{ padding: 8 }}>{config.value}</td>
                  <td style={{ padding: 8 }}>{config.description ?? '-'}</td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && !error && (
                <tr><td colSpan={3} className="text-muted" style={{ padding: 12 }}>No configs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
