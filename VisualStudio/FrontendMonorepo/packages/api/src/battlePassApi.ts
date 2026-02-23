// Battle Pass API (plug-and-play, easy to extend)
// You can swap out fetch logic, endpoints, or add mocks for tests/maintenance.


import type { BattlePassData } from '../../models/src/event';

import { apiClient } from './index';

export async function getBattlePass(): Promise<BattlePassData> {
  const { data } = await apiClient.get<BattlePassData>('/battlepass');
  return data;
}

export async function upgradeBattlePass(type: 'premium' | 'premiumPlus'): Promise<{ success: boolean; message?: string }> {
  const { data } = await apiClient.post<{ success: boolean; message?: string }>(`/battlepass/upgrade`, { type });
  return data;
}

export async function claimBattlePassTier(tierId: string, rewardType: 'free' | 'premium' | 'premiumPlus'): Promise<{ success: boolean; message?: string }> {
  const { data } = await apiClient.post<{ success: boolean; message?: string }>(`/battlepass/claim`, { tierId, rewardType });
  return data;
}
