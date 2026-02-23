// Upgrade VIP level
export async function upgradeVip(): Promise<{ success: boolean; newLevel?: number; message?: string }> {
  const response = await axios.post('/vip/upgrade');
  return response.data;
}
import axios from 'axios';

// Types for VIP data
export interface VipLevel {
  level: number;
  xpRequired: number;
  perks: string[];
  dailyReward: string;
}

export interface VipData {
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
  levels: VipLevel[];
}

export interface VipDailyReward {
  reward: string;
  claimed: boolean;
  claimable: boolean;
  nextReset: string; // ISO string
}

// Fetch VIP data from backend
export async function fetchVipData(): Promise<VipData> {
  const response = await axios.get('/vip');
  return response.data;
}

// Fetch VIP daily reward state
export async function fetchVipDailyReward(): Promise<VipDailyReward> {
  const response = await axios.get('/vip/daily');
  return response.data;
}

// Claim VIP daily reward
export async function claimVipDailyReward(): Promise<{ success: boolean; reward: string; message?: string }> {
  const response = await axios.post('/vip/claim-daily');
  return response.data;
}
