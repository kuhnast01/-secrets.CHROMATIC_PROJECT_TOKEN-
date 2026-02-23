// Commander Tier List (Launch Meta, Complete)
// S, A, B, C tiers for launch meta fantasy

export type CommanderTier = 'S' | 'A' | 'B' | 'C';

export interface CommanderTierEntry {
  commander: string;
  tier: CommanderTier;
  reason: string;
  faction: string;
}

export const COMMANDER_TIER_LIST_FULL: CommanderTierEntry[] = [
  // S-TIER
  { commander: 'Vor’Keth', tier: 'S', reason: 'Resonance engine', faction: 'Obsidian Choir' },
  { commander: 'Karn Vox', tier: 'S', reason: 'Burst king', faction: 'Riftborn' },
  { commander: 'Eclipse Matron', tier: 'S', reason: 'Darkness control', faction: 'Wraithbound' },
  { commander: 'Starless Archon', tier: 'S', reason: 'Endgame monster', faction: 'Obsidian Choir' },
  // A-TIER
  { commander: 'Hollow Admiral', tier: 'A', reason: 'Strong, flexible', faction: 'Wraithbound' },
  { commander: 'Null Harvester', tier: 'A', reason: 'Strong, flexible', faction: 'Wraithbound' },
  { commander: 'Vexa Coil', tier: 'A', reason: 'Strong, flexible', faction: 'Riftborn' },
  { commander: 'Gravemind Corsair', tier: 'A', reason: 'Strong, flexible', faction: 'Riftborn' },
  { commander: 'Starless Cantor', tier: 'A', reason: 'Strong, flexible', faction: 'Obsidian Choir' },
  // B-TIER
  { commander: 'Scrap King', tier: 'B', reason: 'Specialized, high skill', faction: 'Riftborn' },
  { commander: 'Choir Architect', tier: 'B', reason: 'Specialized, high skill', faction: 'Obsidian Choir' },
  { commander: 'Obsidian Oracle', tier: 'B', reason: 'Specialized, high skill', faction: 'Obsidian Choir' },
  { commander: 'Resonant Warden', tier: 'B', reason: 'Specialized, high skill', faction: 'Obsidian Choir' },
  // C-TIER
  { commander: 'Spectral Warlord', tier: 'C', reason: 'Swarm is situational', faction: 'Wraithbound' }
];
