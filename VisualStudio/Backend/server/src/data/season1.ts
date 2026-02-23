// Season 1 metadata
export const SEASON_1 = {
  seasonId: 'S1_AWAKENING_OF_THE_CHOIR',
  name: 'The Awakening of the Choir',
  durationDays: 56,
  currencyId: 'CHOIR_RESONANCE',
  shopId: 'CHOIR_FORGE',
  startDate: null, // To be set
  endDate: null // To be set
};

// Example seasonal missions
export const SEASON_1_MISSIONS = [
  {
    missionId: 'S1_M1_STARLESS_PROBE',
    seasonId: 'S1_AWAKENING_OF_THE_CHOIR',
    name: 'Starless Probe',
    sector: 3,
    type: 'SKIRMISH',
    recommendedPower: 22000,
    enemyTemplateId: 'CHOIR_SKIRMISH_EARLY',
    mutators: ['DARKNESS_ACCURACY_PENALTY'],
    rewards: [
      { currencyId: 'CHOIR_RESONANCE', amount: 50 },
      { currencyId: 'DATA', amount: 200 },
      { itemId: 'BLUEPRINT_FRAGMENT_TIER2', amount: 1 }
    ]
  },
  {
    missionId: 'S1_M2_NULLWAVE_FRONT',
    seasonId: 'S1_AWAKENING_OF_THE_CHOIR',
    name: 'Nullwave Front',
    sector: 3,
    type: 'HAZARD',
    recommendedPower: 26000,
    enemyTemplateId: 'CHOIR_HAZARD_NULLWAVE',
    mutators: ['NULLWAVE_ABILITY_LOCK'],
    rewards: [
      { currencyId: 'CHOIR_RESONANCE', amount: 60 },
      { currencyId: 'RARE_ALLOY', amount: 1 },
      { currencyId: 'COMMANDER_SHARD', amount: 1 }
    ]
  }
  // ...more missions
];

// Example seasonal bosses
export const SEASON_1_BOSSES = [
  {
    bossId: 'S1_B1_CHOIR_ECHO',
    name: 'Choir Prime Echo',
    sector: 3,
    power: 36000,
    phases: 3,
    keyMechanics: ['Shielded', 'Pulse', 'Summons'],
    rewards: ['CHOIR_RESONANCE', 'EPIC_BLUEPRINT', 'COMMANDER_SHARDS', 'COSMETIC_FRAGMENT']
  },
  {
    bossId: 'S1_B2_FINAL_HYMN',
    name: 'The Final Hymn',
    sector: 3,
    power: 42000,
    phases: 4,
    keyMechanics: ['Darkness', 'shield drain', 'resonance stacks', 'enrage'],
    rewards: ['LARGE_CHOIR_RESONANCE', 'LEGENDARY_SHARDS', 'ABILITY_MODULE', 'EXCLUSIVE_SKIN']
  }
];

// Example seasonal shop
export const SEASON_1_SHOP = [
  {
    shopId: 'CHOIR_FORGE',
    itemId: 'S1_SHOP_CMD_SHARDS_LGND',
    type: 'COMMANDER_SHARDS',
    commanderId: 'LEGENDARY_CHOIR_COMMANDER',
    cost: { currencyId: 'CHOIR_RESONANCE', amount: 500 },
    limits: { perSeason: 10, perDay: null },
    availability: { startTime: null, endTime: null }
  },
  {
    shopId: 'CHOIR_FORGE',
    itemId: 'S1_SHOP_EPIC_BLUEPRINT',
    type: 'TECH_BLUEPRINT',
    cost: { currencyId: 'CHOIR_RESONANCE', amount: 300 },
    limits: { perSeason: null, perDay: null, perWeek: 5 },
    availability: { startTime: null, endTime: null }
  }
  // ...more items
];
