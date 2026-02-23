import { useEffect, useState } from 'react';

type SystemHealth = {
  uptime: number;
  platform: string;
  arch: string;
  totalmem: number;
  freemem: number;
  cpus: number;
  loadavg: number[];
  hostname: string;
  userInfo: any;
};

export function useSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        // @ts-ignore
        const result = await window.electronAPI?.invoke('system:getHealth');
        setHealth(result);
      } catch (e) {
        setError('Failed to fetch system health');
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  return { health, loading, error };
}
