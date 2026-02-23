
import React from 'react';
import styles from './Dashboard.module.css';
import { useSystemHealth } from './useSystemHealth';
import { useBackendHealth } from './useBackendHealth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';


export default function Dashboard() {
  const { health, loading, error } = useSystemHealth();
  const { health: backend, loading: backendLoading, error: backendError } = useBackendHealth();

  // Prepare data for charts
  const memData = health ? [
    { name: 'Total', value: +(health.totalmem / 1024 / 1024 / 1024).toFixed(2) },
    { name: 'Free', value: +(health.freemem / 1024 / 1024 / 1024).toFixed(2) },
  ] : [];
  const loadData = health ? health.loadavg.map((v, i) => ({ name: ['1m', '5m', '15m'][i], value: +v.toFixed(2) })) : [];

  return (
    <div>
      <h2>System Dashboard</h2>
      <section className={styles['section-margin']}>
        <h3>System Health</h3>
        {loading && <p>Loading system health...</p>}
        {error && <p className={styles['section-error']}>{error}</p>}
        {health && (
          <>
            <ul className={styles['health-list']}>
              <li><b>Uptime:</b> {Math.floor(health.uptime / 60)} min</li>
              <li><b>Platform:</b> {health.platform} ({health.arch})</li>
              <li><b>CPUs:</b> {health.cpus}</li>
              <li><b>Hostname:</b> {health.hostname}</li>
              <li><b>User:</b> {health.userInfo?.username}</li>
            </ul>
            <div className={styles['flex-wrap']}>
              <div className={styles['memory-panel']}>
                <h4 className={styles['panel-title']}>Memory (GB)</h4>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={memData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={styles['load-panel']}>
                <h4 className={styles['panel-title']}>Load Average</h4>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={loadData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </section>
      <section>
        <h3>Backend Health</h3>
        {backendLoading && <p>Loading backend health...</p>}
        {backendError && <p className={styles['section-error']}>{backendError}</p>}
        {backend && (
          <pre className={styles['backend-pre']}>
            {JSON.stringify(backend, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}
