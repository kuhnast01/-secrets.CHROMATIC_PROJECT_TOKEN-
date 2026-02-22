import { useEffect, useState } from 'react';

export function useBackendHealth() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        // @ts-ignore
        const result = await window.electronAPI?.invoke('adminPanel:health');
        setHealth(result);
      } catch (e) {
        setError('Failed to fetch backend health');
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  return { health, loading, error };
}
