// PvP Ecosystem - Full Production Data Model
// Modular, extensible, and ready for backend implementation

export type PvPMode = 'FleetArena' | 'CommanderArena' | 'FactionArena' | 'SeasonalLadder';
export type PvPDivision = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Obsidian';
export type PvPCurrency = 'ArenaToken' | 'CommanderToken' | 'FactionArenaToken' | 'SeasonalPvPToken';

export interface PvPPlayer {
  userId: string;
  username: string;
  fleetPower: number;
  commanderRarity: number;
  rank: number;
  division: PvPDivision;
  mmr: number;
  winStreak: number;
  lossStreak: number;
  defenseFleet: PvPFleet;
  attackHistory: PvPBattle[];
  defenseHistory: PvPBattle[];
  currencies: Record<PvPCurrency, number>;
}

export interface PvPFleet {
  ships: string[]; // ship IDs
  commander: string; // commander ID
  formation: string;
  abilityPriority: string[];
  faction: string;
}

export interface PvPBattle {
  battleId: string;
  attackerId: string;
  defenderId: string;
  mode: PvPMode;
  result: 'Win' | 'Loss';
  timestamp: number;
  replayId?: string;
  rewards: PvPReward[];
}

export interface PvPReward {
  currency: PvPCurrency;
  amount: number;
  items?: string[];
}

export interface PvPShopItem {
  itemId: string;
  name: string;
  type: 'LegendaryShard' | 'Blueprint' | 'Module' | 'Cosmetic' | 'SkipTicket' | 'Energy';
  cost: number;
  currency: PvPCurrency;
  stock: number;
  refreshType: 'Daily' | 'Weekly' | 'Seasonal';
}

export interface PvPMatchmakingFactors {
  fleetPower: number;
  commanderRarity: number;
  playerRank: number;
  winStreak: number;
  lossStreak: number;
  mmr: number;
}

export interface PvPDefenseAIConfig {
  prioritizeLowHP: boolean;
  useAbilitiesOnCooldown: boolean;
  recognizeFormationWeakness: boolean;
  useFactionSynergy: boolean;
  useCommanderUlt: boolean;
}

export interface PvPSeason {
  seasonId: string;
  start: number;
  end: number;
  divisionRewards: Record<PvPDivision, PvPReward[]>;
  cosmeticRewards: string[];
  titleRewards: string[];
}

export const PVP_SHOPS: Record<PvPMode, PvPShopItem[]> = {
  FleetArena: [],
  CommanderArena: [],
  FactionArena: [],
  SeasonalLadder: [],
};

export const PVP_MODES: PvPMode[] = ['FleetArena', 'CommanderArena', 'FactionArena', 'SeasonalLadder'];
export const PVP_DIVISIONS: PvPDivision[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Obsidian'];

// PvP LiveOps, Monetization, and UI/UX integration would be similarly modular.
