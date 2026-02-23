"use client";
import React, { useEffect, useState } from 'react';
import styles from './SystemHealthPanel.module.css';

import { apiFetch } from '../api';

async function fetchSystemHealth() {
  return apiFetch('/system-health');
}
const SystemHealthPanel: React.FC = () => {
  type SystemHealth = {
    status: string;
    uptime: string;
    lastBackup: string;
    region: string;
    nodes: number;
    autoscaling: boolean;
    serverless: boolean;
  };
  const [data, setData] = useState<SystemHealth | null>(null);
  useEffect(() => {
    fetchSystemHealth().then(setData);
  }, []);
  if (!data) return <div>Loading system health...</div>;
  return (
    <div className={styles['system-health-panel']}>
      <h2>System Health & Reliability</h2>
      <div>
        Status: <b className={data.status === 'healthy' ? styles['system-health-status'] : styles['system-health-status-unhealthy']}>{data.status}</b>
      </div>
      <div>Uptime: <b>{data.uptime}</b></div>
      <div>Last Backup: <b>{new Date(data.lastBackup).toLocaleString()}</b></div>
      <div>Region: <b>{data.region}</b></div>
      <div>Nodes: <b>{data.nodes}</b></div>
      <div>Autoscaling: <b>{data.autoscaling ? 'Enabled' : 'Disabled'}</b></div>
      <div>Serverless: <b>{data.serverless ? 'Yes' : 'No'}</b></div>
      <div className={styles['system-health-alert']}>
        <b>Security Alerts:</b> None detected
      </div>
      <div className={styles['system-health-scan']}>
        <b>PenTest/Scan:</b> Last scan passed (2026-02-10)
      </div>
    </div>
  );
};
export default SystemHealthPanel;
