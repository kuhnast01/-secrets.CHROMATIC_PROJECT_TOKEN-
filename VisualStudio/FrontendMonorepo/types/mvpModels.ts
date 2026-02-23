// MVP Data Models for STARLESS ASCENDANT

export interface Building {
  id: string;
  name: string;
  role: string;
  effect: string;
  maxLevel: number;
  baseCost: Record<string, number>;
  baseTime: number;
  scaling: { cost: number; time: number };
  dependencies: string[];
}

export interface Resource {
  id: string;
  name: string;
  type: "primary" | "premium";
  generatedBy: string;
  generationFormula: string;
  baseRate: number;
  storageCap: number;
  usageSinks: string[];
  notes?: string;
}

export interface Commander {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  role: string;
  statModifiers: Record<string, number>;
  passive: string;
  ultimate: string;
  shardRequirements: { unlock: number; rankUp: number };
}

export interface Ship {
  id: string;
  class: string;
  role: string;
  baseStats: Record<string, number>;
  capacityCost: number;
  buildCost: Record<string, number>;
  buildTime: number;
  unlockRequirement: string;
}

export interface TechNode {
  id: string;
  branch: string;
  tier: number;
  name: string;
  effect: string;
  cost: number;
  time: string;
  requirements: string[];
}

export interface Sector {
  id: string;
  name: string;
  unlockRequirement: string;
  recommendedPower: number;
  missionCount: number;
  bossMissionId: string;
  rewardMultiplier: number;
  enemyTheme: string;
  notes?: string;
}

export interface Mission {
  id: string;
  sectorId: string;
  number: number;
  type: string;
  recommendedPower: number;
  enemyTemplateId: string;
  rewardMultiplier: number;
  notes?: string;
}
