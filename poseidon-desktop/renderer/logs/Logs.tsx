
import React, { useEffect, useState } from 'react';

type LogEntry = { timestamp: string; level: string; message: string };

function parseLogLine(line: string): LogEntry | null {
  // Example: 2026-02-17T12:34:56Z [ERROR] Something failed
  const match = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z) \[(\w+)\] (.*)$/);
  if (!match) return null;
  return { timestamp: match[1], level: match[2], message: match[3] };
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        // @ts-ignore
        const res = await window.electronAPI?.invoke('tools:searchLogs', 'backend/logs/error.log', 'error|fail|warn');
        if (res?.status === 'ok') {
          const entries = res.matches
            .map(parseLogLine)
            .filter(Boolean) as LogEntry[];
          setLogs(entries);
        } else {
          setError(res?.error || 'Unknown error');
        }
      } catch (e) {
        setError('Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const levelColor = (level: string) => {
    if (level === 'ERROR') return 'var(--color-error)';
    if (level === 'WARN') return '#f59e42';
    return 'var(--color-text)';
  };

  return (
    <div className="poseidon-container">
      <h2>Logs & Monitoring</h2>
      <div className="poseidon-card">
        <h3 style={{ marginTop: 0 }}>Recent Errors & Warnings</h3>
        {loading && <p>Loading logs...</p>}
        {error && <p className="text-error">{error}</p>}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Time</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Level</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td style={{ padding: 8, color: 'var(--color-muted)' }}>{log.timestamp}</td>
                  <td style={{ padding: 8, color: levelColor(log.level), fontWeight: 600 }}>{log.level}</td>
                  <td style={{ padding: 8 }}>{log.message}</td>
                </tr>
              ))}
              {logs.length === 0 && !loading && !error && (
                <tr><td colSpan={3} className="text-muted" style={{ padding: 12 }}>No recent errors or warnings.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
