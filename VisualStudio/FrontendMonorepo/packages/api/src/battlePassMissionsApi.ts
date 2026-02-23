// Battle Pass Missions API (plug-and-play, extensible)
export type BattlePassMissionType = 'daily' | 'weekly' | 'seasonal';
export interface BattlePassMission {
  id: string;
  description: string;
  progress: number;
  goal: number;
  claimed: boolean;
  reward: string;
  type: BattlePassMissionType;
}

import { apiClient } from './index';

export async function getBattlePassMissions(): Promise<BattlePassMission[]> {
  const { data } = await apiClient.get<BattlePassMission[]>('/battlepass/missions');
  return data;
}

// In-memory mock missions for demonstration
let _mockMissions: BattlePassMission[] | null = null;

export async function claimBattlePassMission(missionId: string): Promise<{ success: boolean; message?: string }> {
  const { data } = await apiClient.post<{ success: boolean; message?: string }>(`/battlepass/missions/claim`, { missionId });
  return data;
}
