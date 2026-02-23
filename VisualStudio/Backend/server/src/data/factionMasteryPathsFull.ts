// Faction Mastery Paths (Full Progression)
// Each faction has a 5-tier mastery path with XP, unlocks, relic rates, and token economy

export interface FactionMasteryTier {
  tier: number;
  name: string;
  requirement: string;
  unlock: string;
  reward: string;
}

export interface FactionMasteryFull {
  faction: string;
  title: string;
  tiers: FactionMasteryTier[];
}

export const FACTION_MASTERY_PATHS_FULL: FactionMasteryFull[] = [
  {
    faction: 'Wraithbound',
    title: 'The Spectral Ascension',
    tiers: [
      {
        tier: 1,
        name: 'Initiate of Echoes',
        requirement: 'Defeat 50 Wraithbound ships',
        unlock: 'Wraithbound Daily Missions',
        reward: '50 Wraith Tokens'
      },
      {
        tier: 2,
        name: 'Keeper of Shadows',
        requirement: 'Complete 10 Wraithbound missions',
        unlock: 'Darkness Mutator Training',
        reward: '100 Wraith Tokens'
      },
      {
        tier: 3,
        name: 'Harrowed Captain',
        requirement: 'Earn 10 Wraithbound Relics',
        unlock: 'Wraithbound Trials (3 missions)',
        reward: '150 Wraith Tokens'
      },
      {
        tier: 4,
        name: 'Spectral Commander',
        requirement: 'Defeat Wraithbound Challenge Boss',
        unlock: 'Legendary Unlock Missions',
        reward: '200 Wraith Tokens'
      },
      {
        tier: 5,
        name: 'Wraith Ascendant',
        requirement: 'Earn 20 Wraithbound Relics',
        unlock: 'All 5 Legendary Commanders',
        reward: '300 Wraith Tokens'
      }
    ]
  },
  {
    faction: 'Riftborn',
    title: 'The Rift Ascension',
    tiers: [
      {
        tier: 1,
        name: 'Scavenger Recruit',
        requirement: 'Defeat 50 Riftborn ships',
        unlock: 'Riftborn Daily Missions',
        reward: '50 Rift Tokens'
      },
      {
        tier: 2,
        name: 'Marauder Captain',
        requirement: 'Complete 10 Riftborn missions',
        unlock: 'EMP Mutator Training',
        reward: '100 Rift Tokens'
      },
      {
        tier: 3,
        name: 'Riftbreaker',
        requirement: 'Earn 10 Rift Shards',
        unlock: 'Riftborn Trials',
        reward: '150 Rift Tokens'
      },
      {
        tier: 4,
        name: 'Crown’s Chosen',
        requirement: 'Defeat Riftborn Challenge Boss',
        unlock: 'Legendary Unlock Missions',
        reward: '200 Rift Tokens'
      },
      {
        tier: 5,
        name: 'Rift Ascendant',
        requirement: 'Earn 20 Rift Shards',
        unlock: 'All 5 Legendary Commanders',
        reward: '300 Rift Tokens'
      }
    ]
  },
  {
    faction: 'Obsidian Choir',
    title: 'The Harmonic Ascension',
    tiers: [
      {
        tier: 1,
        name: 'Harmonic Initiate',
        requirement: 'Defeat 50 Choir ships',
        unlock: 'Choir Daily Missions',
        reward: '50 Choir Tokens'
      },
      {
        tier: 2,
        name: 'Resonant Keeper',
        requirement: 'Complete 10 Choir missions',
        unlock: 'Resonance Mutator Training',
        reward: '100 Choir Tokens'
      },
      {
        tier: 3,
        name: 'Choir Warden',
        requirement: 'Earn 10 Harmonic Nodes',
        unlock: 'Choir Trials',
        reward: '150 Choir Tokens'
      },
      {
        tier: 4,
        name: 'Starless Conductor',
        requirement: 'Defeat Choir Challenge Boss',
        unlock: 'Legendary Unlock Missions',
        reward: '200 Choir Tokens'
      },
      {
        tier: 5,
        name: 'Choir Ascendant',
        requirement: 'Earn 20 Harmonic Nodes',
        unlock: 'All 5 Legendary Commanders',
        reward: '300 Choir Tokens'
      }
    ]
  }
];
