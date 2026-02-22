import React, { useEffect, useState } from 'react';

type DeviceHealth = {
  id: number;
  name: string;
  status: string;
  latency_ms: number | null;
  temperature_c: number | null;
  frame_rate: number | null;
  storage_used_pct: number | null;
};

export default function DeviceHealthPanel() {
  const [devices, setDevices] = useState<DeviceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:4000/device-health', { credentials: 'include' })
      .then(r => r.json())
      .then(setDevices)
      .catch(() => setError('Failed to fetch device health'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="poseidon-container">
      <h2>Device Health</h2>
      <div className="poseidon-card">
        {loading && <p>Loading device health...</p>}
        {error && <p className="text-error">{error}</p>}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Device</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Latency (ms)</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Temp (°C)</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Frame Rate</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Storage Used (%)</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(device => (
                <tr key={device.id}>
                  <td style={{ padding: 8 }}>{device.name}</td>
                  <td style={{ padding: 8 }}>{device.status}</td>
                  <td style={{ padding: 8 }}>{device.latency_ms ?? '-'}</td>
                  <td style={{ padding: 8 }}>{device.temperature_c ?? '-'}</td>
                  <td style={{ padding: 8 }}>{device.frame_rate ?? '-'}</td>
                  <td style={{ padding: 8 }}>{device.storage_used_pct ?? '-'}</td>
                </tr>
              ))}
              {devices.length === 0 && !loading && !error && (
                <tr><td colSpan={6} className="text-muted" style={{ padding: 12 }}>No device health data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
