// Guilds/Alliances System - Full Production Data Model
// Modular, extensible, and ready for backend implementation

export type GuildRole = 'Leader' | 'Officer' | 'Veteran' | 'Member' | 'Recruit';

export interface GuildMember {
  userId: string;
  username: string;
  role: GuildRole;
  fleetPower: number;
  commanderCount: number;
  joinDate: number;
  contribution: number;
  isActive: boolean;
}

export interface Guild {
  guildId: string;
  name: string;
  emblem: string;
  description: string;
  level: number;
  xp: number;
  memberCap: number;
  members: GuildMember[];
  roles: Record<GuildRole, string[]>; // userIds by role
  banner: string;
  motto: string;
  achievements: string[];
  power: number;
  tokens: number;
  raidTokens: number;
  warTokens: number;
  shop: GuildShopItem[];
  activityFeed: GuildActivity[];
  chat: GuildChatMessage[];
  recruitment: GuildRecruitment;
  settings: GuildSettings;
  createdAt: number;
  updatedAt: number;
}

export interface GuildRecruitment {
  minFleetPower: number;
  minCommanderCount: number;
  factionAlignment?: string;
  joinType: 'Open' | 'Invite' | 'Closed';
  applications: GuildApplication[];
}

export interface GuildApplication {
  userId: string;
  username: string;
  fleetPower: number;
  commanderCount: number;
  message?: string;
  appliedAt: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

export interface GuildSettings {
  allowDonations: boolean;
  allowChat: boolean;
  allowRecruitment: boolean;
  officerLimit: number;
  veteranLimit: number;
  memberCap: number;
}

export interface GuildShopItem {
  itemId: string;
  name: string;
  type: 'CommanderShard' | 'Blueprint' | 'Module' | 'RaidKey' | 'Cosmetic' | 'BannerPiece' | 'Boost';
  cost: number;
  currency: 'GuildToken' | 'RaidToken' | 'WarToken';
  stock: number;
  refreshType: 'Daily' | 'Weekly' | 'Seasonal';
}

export interface GuildActivity {
  type: 'Join' | 'Leave' | 'Promotion' | 'Demotion' | 'RaidDamage' | 'WarWin' | 'LegendaryUnlock' | 'Donation' | 'Message' | 'Achievement';
  userId?: string;
  username?: string;
  details?: string;
  timestamp: number;
}

export interface GuildChatMessage {
  userId: string;
  username: string;
  message: string;
  channel: 'Global' | 'Officer' | 'Raid' | 'War';
  timestamp: number;
}

// Guild Progression
export interface GuildLevelReward {
  level: number;
  memberCap: number;
  shopUpgrade: string;
  raidBonus: string;
  bannerUpgrade: string;
  cosmeticUnlock: string;
}

export const GUILD_LEVEL_REWARDS: GuildLevelReward[] = [
  { level: 1, memberCap: 30, shopUpgrade: 'Basic', raidBonus: 'None', bannerUpgrade: 'Default', cosmeticUnlock: 'None' },
  { level: 2, memberCap: 32, shopUpgrade: 'Improved', raidBonus: '+2% raid damage', bannerUpgrade: 'Color 1', cosmeticUnlock: 'Frame 1' },
  { level: 3, memberCap: 35, shopUpgrade: 'Advanced', raidBonus: '+5% raid damage', bannerUpgrade: 'Icon 1', cosmeticUnlock: 'Frame 2' },
  // ...expand as needed
];

// Guild Activities (Daily/Weekly Missions)
export interface GuildMission {
  missionId: string;
  type: 'Daily' | 'Weekly';
  description: string;
  requirement: string;
  reward: string;
}

export const GUILD_MISSIONS: GuildMission[] = [
  { missionId: 'd1', type: 'Daily', description: 'Win 10 battles', requirement: '10 wins', reward: 'Guild XP, Guild Tokens, Raid Key' },
  { missionId: 'd2', type: 'Daily', description: 'Complete 5 sector missions', requirement: '5 sector missions', reward: 'Guild XP, Guild Tokens' },
  { missionId: 'd3', type: 'Daily', description: 'Spend 500 energy', requirement: '500 energy', reward: 'Guild XP, Raid Key' },
  { missionId: 'd4', type: 'Daily', description: 'Donate resources', requirement: '1 donation', reward: 'Guild XP, Guild Tokens' },
  { missionId: 'w1', type: 'Weekly', description: 'Defeat 3 bosses', requirement: '3 boss kills', reward: 'Legendary Shards, Guild Cosmetics, Raid Currency' },
  { missionId: 'w2', type: 'Weekly', description: 'Earn 10,000 fleet power', requirement: '10,000 fleet power', reward: 'Guild XP, Guild Tokens' },
  { missionId: 'w3', type: 'Weekly', description: 'Complete 20 faction missions', requirement: '20 faction missions', reward: 'Guild XP, Raid Currency' },
];

// Guild Raids, Wars, Shops, Donations, Social, and LiveOps integration would be similarly modular.
