// Raid system data models for Guild Raids and Solo Raids
// --- Types ---

export type RaidDifficulty = 'Normal' | 'Hard' | 'Nightmare' | 'Elite';
export type RaidPhase = {
  phaseId: string;
  name: string;
  description: string;
  boss: string;
  hp: number;
  mutators: string[];
  mechanics: string[];
};

export type GuildRaid = {
  raidId: string;
  name: string;
  faction: string;
  difficulty: RaidDifficulty;
  phases: RaidPhase[];
  currentPhase: number;
  totalHp: number;
  remainingHp: number;
  attemptsPerMember: number;
  resetAt: number;
  startedAt: number;
  endedAt?: number;
  guildId: string;
  progress: { userId: string; damage: number; attempts: number; lastAttack: number }[];
  leaderboard: { userId: string; username: string; damage: number }[];
  completed: boolean;
};

export type SoloRaid = {
  raidId: string;
  name: string;
  mode: 'DailyGauntlet' | 'FactionTrial' | 'LegendaryGauntlet';
  difficulty: RaidDifficulty;
  waves: number;
  userId: string;
  progress: { wave: number; damage: number; time: number }[];
  completed: boolean;
  score: number;
  startedAt: number;
  endedAt?: number;
  leaderboard?: { userId: string; username: string; score: number }[];
};

// --- Raid Definitions ---

export const GUILD_RAIDS = [
  {
    raidId: 'wraithbound-raid',
    name: 'The Silent Armada',
    faction: 'Wraithbound',
    difficulty: 'Normal',
    phases: [
      {
        phaseId: '1',
        name: 'Ghost Frigates',
        description: 'Stealthy, high evasion enemies.',
        boss: 'Ghost Frigate Squadron',
        hp: 100000,
        mutators: ['evasion in darkness'],
        mechanics: ['high evasion', 'stealth']
      },
      {
        phaseId: '2',
        name: 'Spectral Cruisers',
        description: 'Shield drain and darkness.',
        boss: 'Spectral Cruiser Pair',
        hp: 150000,
        mutators: ['amplified shield drain'],
        mechanics: ['shield drain', 'darkness']
      },
      {
        phaseId: '3',
        name: 'The Silent Dreadnought',
        description: 'Multi-lane cannons, darkness pulses.',
        boss: 'Silent Dreadnought',
        hp: 250000,
        mutators: ['evasion in darkness', 'amplified shield drain'],
        mechanics: ['multi-lane', 'darkness pulses']
      }
    ],
    currentPhase: 0,
    totalHp: 500000,
    remainingHp: 500000,
    attemptsPerMember: 3,
    resetAt: 0,
    startedAt: 0,
    guildId: '',
    progress: [],
    leaderboard: [],
    completed: false
  },
  // ...Riftborn and Obsidian Choir raids (see prompt for details)
];

export const SOLO_RAIDS = [
  {
    raidId: 'daily-gauntlet',
    name: 'Daily Gauntlet',
    mode: 'DailyGauntlet',
    difficulty: 'Normal',
    waves: 10,
    userId: '',
    progress: [],
    completed: false,
    score: 0,
    startedAt: 0
  },
  // ...Faction Trials, Legendary Gauntlet
];

// Raid shops, rewards, mutators, and rotation will be defined in endpoints.
