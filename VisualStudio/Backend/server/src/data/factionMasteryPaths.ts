// Faction Mastery Paths for each faction
// Each faction has a 5-step mastery path with faction-specific content

export type Faction = 'Wraithbound' | 'Riftborn' | 'Obsidian Choir';

export interface FactionMasteryStep {
  step: number;
  name: string;
  description: string;
  requirement: string;
  details?: string[];
}

export interface FactionMasteryPath {
  faction: Faction;
  steps: FactionMasteryStep[];
}

export const FACTION_MASTERY_PATHS: FactionMasteryPath[] = [
  {
    faction: 'Wraithbound',
    steps: [
      {
        step: 1,
        name: 'Faction Reputation',
        description: 'Earned by defeating Wraithbound enemies in daily missions, Faction War, and seasonal events.',
        requirement: 'Reach Reputation Level 10 for first Legendary, Level 20 for final Legendary',
        details: ['Daily missions', 'Faction War events', 'Seasonal events']
      },
      {
        step: 2,
        name: 'Faction Trials',
        description: 'Complete 3–5 missions testing stealth, darkness, and shield drain mechanics.',
        requirement: 'Complete all Wraithbound Trials',
        details: ['Unique mutator per trial', 'Unique enemy formation', 'Unique reward']
      },
      {
        step: 3,
        name: 'Wraithbound Relics',
        description: 'Collect Spectral Cores from strongholds, bosses, and events.',
        requirement: 'Collect 10–20 Spectral Cores depending on commander',
        details: ['Strongholds', 'Bosses', 'Seasonal events', 'Faction War']
      },
      {
        step: 4,
        name: 'Faction Challenge Boss',
        description: 'Defeat “The Silent Dreadnought” in a unique boss encounter.',
        requirement: 'Defeat the Wraithbound Challenge Boss',
        details: ['Fleet composition', 'Counterplay', 'Faction mechanics']
      },
      {
        step: 5,
        name: 'Faction Tokens',
        description: 'Earn Wraithbound Tokens from Faction War, daily missions, and events.',
        requirement: 'Collect 500–800 tokens depending on commander',
        details: ['Faction War', 'Daily missions', 'Seasonal events']
      }
    ]
  },
  {
    faction: 'Riftborn',
    steps: [
      {
        step: 1,
        name: 'Faction Reputation',
        description: 'Earned by defeating Riftborn enemies in daily missions, Faction War, and seasonal events.',
        requirement: 'Reach Reputation Level 10 for first Legendary, Level 20 for final Legendary',
        details: ['Daily missions', 'Faction War events', 'Seasonal events']
      },
      {
        step: 2,
        name: 'Faction Trials',
        description: 'Complete 3–5 missions testing burst, EMP, and chaos mechanics.',
        requirement: 'Complete all Riftborn Trials',
        details: ['Unique mutator per trial', 'Unique enemy formation', 'Unique reward']
      },
      {
        step: 3,
        name: 'Riftborn Relics',
        description: 'Collect Rift Shards from strongholds, bosses, and events.',
        requirement: 'Collect 10–20 Rift Shards depending on commander',
        details: ['Strongholds', 'Bosses', 'Seasonal events', 'Faction War']
      },
      {
        step: 4,
        name: 'Faction Challenge Boss',
        description: 'Defeat “The Riftbreaker Hulk” in a unique boss encounter.',
        requirement: 'Defeat the Riftborn Challenge Boss',
        details: ['Fleet composition', 'Counterplay', 'Faction mechanics']
      },
      {
        step: 5,
        name: 'Faction Tokens',
        description: 'Earn Riftborn Tokens from Faction War, daily missions, and events.',
        requirement: 'Collect 500–800 tokens depending on commander',
        details: ['Faction War', 'Daily missions', 'Seasonal events']
      }
    ]
  },
  {
    faction: 'Obsidian Choir',
    steps: [
      {
        step: 1,
        name: 'Faction Reputation',
        description: 'Earned by defeating Obsidian Choir enemies in daily missions, Faction War, and seasonal events.',
        requirement: 'Reach Reputation Level 10 for first Legendary, Level 20 for final Legendary',
        details: ['Daily missions', 'Faction War events', 'Seasonal events']
      },
      {
        step: 2,
        name: 'Faction Trials',
        description: 'Complete 3–5 missions testing resonance, formation, and shield regen mechanics.',
        requirement: 'Complete all Choir Trials',
        details: ['Unique mutator per trial', 'Unique enemy formation', 'Unique reward']
      },
      {
        step: 3,
        name: 'Choir Relics',
        description: 'Collect Harmonic Nodes from strongholds, bosses, and events.',
        requirement: 'Collect 10–20 Harmonic Nodes depending on commander',
        details: ['Strongholds', 'Bosses', 'Seasonal events', 'Faction War']
      },
      {
        step: 4,
        name: 'Faction Challenge Boss',
        description: 'Defeat “The Harmonic Sentinel” in a unique boss encounter.',
        requirement: 'Defeat the Choir Challenge Boss',
        details: ['Fleet composition', 'Counterplay', 'Faction mechanics']
      },
      {
        step: 5,
        name: 'Faction Tokens',
        description: 'Earn Choir Tokens from Faction War, daily missions, and events.',
        requirement: 'Collect 500–800 tokens depending on commander',
        details: ['Faction War', 'Daily missions', 'Seasonal events']
      }
    ]
  }
];
