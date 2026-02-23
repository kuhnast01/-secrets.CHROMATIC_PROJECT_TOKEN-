import { useState, useEffect, useCallback } from 'react';
import { getSummonBanners, summonPull, getSummonHistory } from '../api';

// --- Summoning System Hooks ---

export function useSummonBanners(userId?: string) {
  const [banners, setBanners] = useState<any[]>([]);
  const [pity, setPity] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getSummonBanners(userId)
      .then((data: any) => {
        setBanners(data.banners || []);
        setPity(data.pity || {});
        setError(null);
      })
      .catch((e: any) => setError(e.message || 'Failed to load banners'))
      .finally(() => setLoading(false));
  }, [userId]);

  return { banners, pity, loading, error };
}

export function useSummonHistory(userId: string) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getSummonHistory(userId)
      .then((data: any) => {
        setHistory(data.history || []);
        setError(null);
      })
      .catch((e: any) => setError(e.message || 'Failed to load history'))
      .finally(() => setLoading(false));
  }, [userId]);

  return { history, loading, error };
}

export function useSummonAction() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summon = useCallback(async (userId: string, bannerId: string, count: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await summonPull({ userId, bannerId, count });
      setResult(res);
      return res;
    } catch (e: any) {
      setError(e.message || 'Summon failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { summon, result, loading, error };
}
