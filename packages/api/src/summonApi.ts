
import type { SummonBanner } from 'models';
import { apiClient } from './index';

export async function fetchSummonBanners(): Promise<SummonBanner[]> {
  const { data } = await apiClient.get<SummonBanner[]>('/summon/banners');
  return data;
}
// ...existing code...
