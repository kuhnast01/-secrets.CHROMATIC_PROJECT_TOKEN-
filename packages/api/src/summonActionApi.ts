export interface SummonResult {
  units: string[];
  newPity: number;
}

import { apiClient } from './index';

export async function summonOnBanner(bannerId: string): Promise<SummonResult> {
  const { data } = await apiClient.post<SummonResult>(`/summon/${bannerId}`);
  return data;
}
