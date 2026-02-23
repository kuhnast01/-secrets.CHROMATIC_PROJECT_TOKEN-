import type { Player } from 'models';
import { apiClient } from './index';

export async function getPlayer(): Promise<Player> {
  const { data } = await apiClient.get<Player>('/player');
  return data;
}
