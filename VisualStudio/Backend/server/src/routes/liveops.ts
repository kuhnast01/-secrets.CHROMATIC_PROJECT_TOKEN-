// --- VIP System Type Definitions ---
type VIPLevel = {
  level: number;
  xpRequired: number;
  name: string;
  permanentPerks: string[];
  unlocks?: string[];
  dailyRewards: { type: string; amount: number; frequency?: string }[];
  cosmetic?: { id: string; type: string; name: string; rarity: string };
};

const VIP_LEVELS: VIPLevel[] = [
  {
    level: 1,
    xpRequired: 0,
    name: 'Warden of the Rift',
    permanentPerks: ['+50 Daily Energy', '+3 Daily Raid Attempts'],
    unlocks: ['VIP Shop Tier 2'],
    dailyRewards: [
      { type: 'credits', amount: 700 },
      { type: 'legendaryShard', amount: 1 }
    ],
    cosmetic: { id: 'emote_riftsurge', type: 'emote', name: 'Rift Surge', rarity: 'legendary' }
  },
  {
    level: 2,
    xpRequired: 100,
    name: 'VIP 2',
    permanentPerks: ['+10 Daily Energy'],
    dailyRewards: [ { type: 'credits', amount: 100 } ]
  },
  {
    level: 3,
    xpRequired: 250,
    name: 'VIP 3',
    permanentPerks: ['+1 Daily Arena Attempt'],
    dailyRewards: [ { type: 'credits', amount: 150 } ]
  },
  {
    level: 4,
    xpRequired: 500,
    name: 'VIP 4',
    permanentPerks: ['+1 Daily Skip Ticket'],
    dailyRewards: [ { type: 'credits', amount: 200 } ]
  },
  {
    level: 5,
    xpRequired: 900,
    name: 'VIP 5',
    permanentPerks: ['+20 Daily Energy', '+2 Daily Raid Attempts'],
    unlocks: ['VIP Shop Tier 2'],
    dailyRewards: [ { type: 'credits', amount: 300 } ],
    cosmetic: { id: 'frame_silver', type: 'profileFrame', name: 'Silver Frame', rarity: 'rare' }
  },
  {
    level: 6,
    xpRequired: 1500,
    name: 'VIP 6',
    permanentPerks: ['+1 Daily Guild Donation'],
    dailyRewards: [ { type: 'credits', amount: 350 } ]
  },
  {
    level: 7,
    xpRequired: 2500,
    name: 'VIP 7',
    permanentPerks: ['+1 Daily Faction Token'],
    dailyRewards: [ { type: 'credits', amount: 400 } ]
  },
  {
    level: 8,
    xpRequired: 4000,
    name: 'VIP 8',
    permanentPerks: ['+1 Daily Arena Attempt'],
    dailyRewards: [ { type: 'credits', amount: 450 } ]
  },
  {
    level: 9,
    xpRequired: 6000,
    name: 'VIP 9',
    permanentPerks: ['+1 Daily Skip Ticket'],
    dailyRewards: [ { type: 'credits', amount: 500 } ]
  },
  {
    level: 10,
    xpRequired: 9000,
    name: 'Choir Ascendant',
    permanentPerks: ['+60 Daily Energy', '+4 Daily Skip Tickets', '+2 Daily Faction Tokens'],
    dailyRewards: [
      { type: 'credits', amount: 800 },
      { type: 'seasonalKey', amount: 1 }
    ],
    cosmetic: { id: 'shipskin_choircruiser_silverresonance', type: 'shipSkin', name: 'Choir Cruiser — Silver Resonance', rarity: 'legendary' }
  },
  {
    level: 11,
    xpRequired: 13000,
    name: 'Prime Conductor',
    permanentPerks: ['+70 Daily Energy', '+4 Daily Arena Attempts'],
    unlocks: ['VIP Missions (Weekly Legendary Shards)'],
    dailyRewards: [
      { type: 'credits', amount: 900 },
      { type: 'seasonalKey', amount: 2 }
    ],
    cosmetic: { id: 'profileframe_choirglyphhalo', type: 'profileFrame', name: 'Choir Glyph Halo', rarity: 'legendary' }
  },
  {
    level: 12,
    xpRequired: 18000,
    name: 'Starless Executor',
    permanentPerks: ['+80 Daily Energy', '+4 Daily Raid Attempts', '+5 Daily Skip Tickets'],
    dailyRewards: [
      { type: 'credits', amount: 1000 },
      { type: 'legendaryCrystal', amount: 1, frequency: 'weekly' }
    ],
    cosmetic: { id: 'emote_starlesschant', type: 'emote', name: 'Starless Chant', rarity: 'legendary' }
  },
  {
    level: 13,
    xpRequired: 24000,
    name: 'Harmonic Sovereign',
    permanentPerks: ['+90 Daily Energy', '+5 Daily Arena Attempts'],
    unlocks: ['VIP Shop Tier 3'],
    dailyRewards: [
      { type: 'credits', amount: 1200 },
      { type: 'seasonalKey', amount: 3 }
    ],
    cosmetic: { id: 'shiptrail_blackvioletchoir', type: 'shipTrail', name: 'Black-Violet Choir Flame', rarity: 'mythic' }
  },
  {
    level: 14,
    xpRequired: 31000,
    name: 'Eclipse Admiral',
    permanentPerks: ['+100 Daily Energy', '+6 Daily Skip Tickets', '+3 Daily Faction Tokens'],
    dailyRewards: [
      { type: 'credits', amount: 1500 },
      { type: 'legendarySummonToken', amount: 1, frequency: 'weekly' }
    ],
    cosmetic: { id: 'profileframe_eclipsecrown', type: 'profileFrame', name: 'Eclipse Crown', rarity: 'mythic' }
  },
  {
    level: 15,
    xpRequired: 39000,
    name: 'Ascendant Prime',
    permanentPerks: ['+120 Daily Energy', '+6 Daily Arena Attempts', '+6 Daily Raid Attempts'],
    unlocks: ['VIP Shop Tier 4', 'Exclusive VIP-Only Cosmetics'],
    dailyRewards: [
      { type: 'credits', amount: 2000 },
      { type: 'legendaryCrystal', amount: 1 }
    ],
    cosmetic: { id: 'skin_vorketh_primeresonant', type: 'commanderSkin', name: 'Vor’Keth — Prime Resonant', rarity: 'mythic' }
  }
];
// --- End VIP System Type Definitions ---
// --- Cosmetics System Type Definitions ---
type Cosmetic = {
  id: string;
  type: 'commanderSkin' | 'shipSkin' | 'profileFrame' | 'title' | 'guildBanner' | 'guildEmblem';
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  seasonId?: string;
  owned: boolean;
  unlockSource: 'battlePass' | 'seasonalShop' | 'raid' | 'pvp' | 'guild' | 'event';
  previewArt: string;
};

// --- Season 1 Cosmetics Mock Data ---
const MOCK_COSMETICS: Cosmetic[] = [
  // Commander Skins
  {
    id: 'skin_vorketh_starless',
    type: 'commanderSkin',
    name: 'Vor’Keth — Starless Ascendant',
    rarity: 'mythic',
    seasonId: 'season1',
    owned: false,
    unlockSource: 'battlePass',
    previewArt: '/art/skins/vorketh_starless.png',
  },
  {
    id: 'skin_choirarchitect_oracle',
    type: 'commanderSkin',
    name: 'Choir Architect — Harmonic Oracle',
    rarity: 'legendary',
    seasonId: 'season1',
    owned: false,
    unlockSource: 'seasonalShop',
    previewArt: '/art/skins/choirarchitect_oracle.png',
  },
  {
    id: 'skin_riftborn_overload',
    type: 'commanderSkin',
    name: 'Riftborn Marauder — Overload Protocol',
    rarity: 'epic',
    seasonId: 'season1',
    owned: false,
    unlockSource: 'raid',
    previewArt: '/art/skins/riftborn_overload.png',
  },
  // Ship Skins
  {
    id: 'shipskin_choircruiser_obsidian',
    type: 'shipSkin',
    name: 'Choir Cruiser — Obsidian Hull',
    rarity: 'legendary',
    seasonId: 'season1',
    owned: false,
    unlockSource: 'battlePass',
    previewArt: '/art/ships/choircruiser_obsidian.png',
  },
  {
    id: 'shipskin_wraithbound_spectral',
    type: 'shipSkin',
    name: 'Wraithbound Frigate — Spectral Veil',
    rarity: 'epic',
    seasonId: 'season1',
    owned: false,
    unlockSource: 'pvp',
    previewArt: '/art/ships/wraithbound_spectral.png',
  },
  // Profile Cosmetics
  {
    id: 'profileframe_firsthymn',
    type: 'profileFrame',
    name: 'Frame: First Hymn',
    rarity: 'epic',
    seasonId: 'season1',
    owned: false,
    unlockSource: 'battlePass',
    previewArt: '/art/profile/frame_firsthymn.png',
  },
  {
    id: 'title_resonant',
    type: 'title',
    name: 'Title: Resonant',
    rarity: 'legendary',
    seasonId: 'season1',
    owned: false,
    unlockSource: 'event',
    previewArt: '/art/profile/title_resonant.png',
  },
  {
    id: 'profilebg_starlesschoir',
    type: 'profileFrame',
    name: 'Background: Starless Choir Chamber',
    rarity: 'legendary',
    seasonId: 'season1',
    owned: false,
    unlockSource: 'event',
    previewArt: '/art/profile/bg_starlesschoir.png',
  },
  // Guild Cosmetics
  {
    id: 'guildbanner_harmonicsigil',
    type: 'guildBanner',
    name: 'Guild Banner Skin — Harmonic Sigil',
    rarity: 'epic',
    seasonId: 'season1',
    owned: false,
    unlockSource: 'raid',
    previewArt: '/art/guild/banner_harmonicsigil.png',
  },
  {
    id: 'guildemblem_choirset',
    type: 'guildEmblem',
    name: 'Guild Emblem Pack — Season 1 Choir Set',
    rarity: 'epic',
    seasonId: 'season1',
    owned: false,
    unlockSource: 'guild',
    previewArt: '/art/guild/emblem_choirset.png',
  },
];
// --- End Season 1 Cosmetics Mock Data ---
// --- Battle Pass System Type Definitions ---
// --- Battle Pass System Type Definitions ---
type BattlePassTrackType = 'free' | 'premium' | 'premiumPlus';

type BattlePassReward = {
  id: string;
  type: 'currency' | 'shard' | 'item' | 'cosmetic';
  subType?: string;
  amount?: number;
};

type BattlePassTier = {
  id: string;
  index: number;
  xpRequired: number;
  rewards: {
    free?: BattlePassReward[];
    premium?: BattlePassReward[];
    premiumPlus?: BattlePassReward[];
  };
};

type BattlePassState = {
  seasonId: string;
  seasonName: string;
  startAt: string;
  endAt: string;
  currentXp: number;
  currentTierIndex: number;
  ownedTracks: BattlePassTrackType[];
  tiers: BattlePassTier[];
  claimedRewards: {
    [tierId: string]: BattlePassTrackType[];
  };
};

type BattlePassMission = {
  id: string;
  type: 'daily' | 'weekly' | 'seasonal';
  name: string;
  description?: string;
  progress: number;
  target: number;
  xpReward: number;
  isCompleted: boolean;
  isClaimed: boolean;
};
// --- End Battle Pass System Type Definitions ---

// --- Battle Pass Mock Data ---
const MOCK_BATTLEPASS_STATE: BattlePassState = {
  seasonId: 'season1',
  seasonName: 'Galactic Dawn',
  startAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  endAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  currentXp: 1350,
  currentTierIndex: 5,
  ownedTracks: ['free'],
  tiers: Array.from({ length: 10 }).map((_, i) => ({
    id: `tier${i + 1}`,
    index: i + 1,
    xpRequired: (i + 1) * 250,
    rewards: {
      free: [{ id: `reward-f${i + 1}`, type: 'currency', subType: 'credits', amount: 1000 * (i + 1) }],
      premium: i % 2 === 0 ? [{ id: `reward-p${i + 1}`, type: 'shard', subType: 'legendaryShard', amount: 1 }] : undefined,
      premiumPlus: i % 3 === 0 ? [{ id: `reward-pp${i + 1}`, type: 'cosmetic', subType: `skin_vorketh_s${i + 1}` }] : undefined
    }
  })),
  claimedRewards: {
    tier1: ['free'],
    tier2: ['free'],
    tier3: ['free'],
    tier4: ['free'],
    tier5: ['free']
  }
};

const MOCK_BATTLEPASS_MISSIONS: BattlePassMission[] = [
  {
    id: 'm1',
    type: 'daily',
    name: 'Win 3 battles',
    progress: 2,
    target: 3,
    xpReward: 100,
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'm2',
    type: 'weekly',
    name: 'Complete 2 raids',
    progress: 2,
    target: 2,
    xpReward: 300,
    isCompleted: true,
    isClaimed: false
  },
  {
    id: 'm3',
    type: 'seasonal',
    name: 'Earn 5000 credits',
    progress: 5000,
    target: 5000,
    xpReward: 500,
    isCompleted: true,
    isClaimed: true
  }
];
// --- End Battle Pass Mock Data ---
// --- Season 1 Shop Rotations & Static Data ---
// Featured Shop (8-week rotation)
const FEATURED_SHOP_ROTATION = [
  // Week 1
  [
    { id: 'seasonal-key-10', name: 'Seasonal Keys', amount: 10, type: 'currency' },
    { id: 'adv-summon-5', name: 'Advanced Summon Tokens', amount: 5, type: 'currency' },
    { id: 'vor-keth-shard', name: 'Choir Commander Shards (Vor’Keth)', amount: 1, type: 'shard' },
    { id: 'choir-cruiser-blueprint', name: 'Choir Cruiser Blueprints', amount: 1, type: 'blueprint' },
    { id: 'cosmetic-choir-emblem', name: 'Cosmetic: Choir Emblem', rarity: 'epic', type: 'cosmetic' }
  ],
  // Week 2
  [
    { id: 'adv-summon-5', name: 'Advanced Summon Tokens', amount: 5, type: 'currency' },
    { id: 'riftborn-shard', name: 'Riftborn Marauder Shards', amount: 1, type: 'shard' },
    { id: 'emp-module', name: 'EMP Module', rarity: 'epic', type: 'module' },
    { id: 'cosmetic-riftborn-trail', name: 'Cosmetic: Riftborn Trail', rarity: 'rare', type: 'cosmetic' }
  ],
  // Week 3
  [
    { id: 'wraithbound-blueprint', name: 'Wraithbound Frigate Blueprints', amount: 1, type: 'blueprint' },
    { id: 'spectral-module', name: 'Spectral Module', rarity: 'epic', type: 'module' },
    { id: 'legendary-shard', name: 'Legendary Shard', amount: 1, type: 'shard' },
    { id: 'cosmetic-wraithbound-frame', name: 'Cosmetic: Wraithbound Frame', rarity: 'epic', type: 'cosmetic' }
  ],
  // Week 4
  [
    { id: 'legendary-crystal', name: 'Legendary Crystal', amount: 1, type: 'crystal' },
    { id: 'seasonal-key-10', name: 'Seasonal Keys', amount: 10, type: 'currency' },
    { id: 'ability-module', name: 'Ability Modules', rarity: 'rare/epic', type: 'module' },
    { id: 'cosmetic-choir-sigil', name: 'Cosmetic: Choir Sigil', rarity: 'legendary', type: 'cosmetic' }
  ],
  // Week 5
  [
    { id: 'raid-tokens-bundle', name: 'Raid Tokens Bundle', type: 'currency' },
    { id: 'choir-raid-module', name: 'Choir Raid Module', rarity: 'epic', type: 'module' },
    { id: 'legendary-shard-2', name: 'Legendary Shard', amount: 2, type: 'shard' },
    { id: 'cosmetic-obsidian-choir-hull', name: 'Cosmetic: Obsidian Choir Hull', rarity: 'legendary', type: 'cosmetic' }
  ],
  // Week 6
  [
    { id: 'arena-tokens-bundle', name: 'Arena Tokens Bundle', type: 'currency' },
    { id: 'pvp-energy', name: 'PvP Energy', type: 'currency' },
    { id: 'commander-shard-rotating', name: 'Commander Shards (rotating)', type: 'shard' },
    { id: 'cosmetic-arena-crown', name: 'Cosmetic: Arena Crown', rarity: 'epic', type: 'cosmetic' }
  ],
  // Week 7
  [
    { id: 'seasonal-key-15', name: 'Seasonal Keys', amount: 15, type: 'currency' },
    { id: 'legendary-crystal', name: 'Legendary Crystal', amount: 1, type: 'crystal' },
    { id: 'choir-boss-module', name: 'Choir Boss Module', rarity: 'epic', type: 'module' },
    { id: 'cosmetic-black-wave-title', name: 'Cosmetic: Black Wave Title', rarity: 'legendary', type: 'cosmetic' }
  ],
  // Week 8
  [
    { id: 'legendary-summon-token', name: 'Legendary Summon Token', type: 'token' },
    { id: 'seasonal-key-20', name: 'Seasonal Keys', amount: 20, type: 'currency' },
    { id: 'prestige-token-bundle', name: 'Prestige Token Bundle', type: 'currency' },
    { id: 'cosmetic-final-hymn-frame', name: 'Cosmetic: “Final Hymn” Frame', rarity: 'mythic', type: 'cosmetic' }
  ]
];

// Seasonal Shop (static + weekly refresh)
const SEASONAL_SHOP_STATIC = [
  { id: 'vor-keth-shard', name: 'Vor’Keth Shard', type: 'shard' },
  { id: 'architect-shard', name: 'Architect Shard', type: 'shard' },
  { id: 'cantor-shard', name: 'Cantor Shard', type: 'shard' },
  { id: 'seasonal-ship-skin', name: 'Seasonal Ship Skin', type: 'cosmetic' },
  { id: 'seasonal-profile-frame', name: 'Seasonal Profile Frame', type: 'cosmetic' },
  { id: 'seasonal-title', name: 'Seasonal Title', type: 'cosmetic' },
  { id: 'seasonal-module', name: 'Seasonal Module', type: 'module' },
  { id: 'seasonal-key', name: 'Seasonal Key', type: 'currency' },
  { id: 'legendary-shard', name: 'Legendary Shard', type: 'shard' },
  { id: 'ability-module', name: 'Ability Module', type: 'module' }
];
const SEASONAL_SHOP_WEEKLY = [
  { id: 'seasonal-module', name: 'Seasonal Module', type: 'module' },
  { id: 'seasonal-cosmetic', name: 'Seasonal Cosmetic', type: 'cosmetic' },
  { id: 'seasonal-shard-pack', name: 'Seasonal Shard Pack', type: 'shard' }
];

// Prestige Shop (2-week rotation)
const PRESTIGE_SHOP_ROTATION = [
  // Rotation A
  [
    { id: 'skin-vorketh-mythic', name: 'Mythic Commander Skin (Vor’Keth — Starless Ascendant)', type: 'cosmetic', rarity: 'mythic' },
    { id: 'frame-legendary', name: 'Legendary Profile Frame', type: 'cosmetic', rarity: 'legendary' },
    { id: 'trail-epic', name: 'Epic Ship Trail', type: 'cosmetic', rarity: 'epic' },
    { id: 'title-resonant-prime', name: 'Prestige Title: “Resonant Prime”', type: 'cosmetic', rarity: 'legendary' }
  ],
  // Rotation B
  [
    { id: 'skin-choir-legendary', name: 'Legendary Ship Skin (Choir Cruiser — Obsidian Hull)', type: 'cosmetic', rarity: 'legendary' },
    { id: 'emote-mythic', name: 'Mythic Emote', type: 'cosmetic', rarity: 'mythic' },
    { id: 'guild-banner-epic', name: 'Epic Guild Banner', type: 'cosmetic', rarity: 'epic' },
    { id: 'title-harmonic-sovereign', name: 'Prestige Title: “Harmonic Sovereign”', type: 'cosmetic', rarity: 'legendary' }
  ]
];

// Arena Shop (static + weekly refresh)
const ARENA_SHOP_STATIC = [
  { id: 'commander-shard-rotating', name: 'Commander Shards (rotating)', type: 'shard' },
  { id: 'ship-blueprint', name: 'Ship Blueprints', type: 'blueprint' },
  { id: 'ability-module', name: 'Ability Module', type: 'module' },
  { id: 'pvp-cosmetic', name: 'PvP Cosmetic', type: 'cosmetic' }
];
const ARENA_SHOP_WEEKLY = [
  { id: 'featured-commander-shard', name: 'Featured Commander Shard', type: 'shard' },
  { id: 'featured-module', name: 'Featured Module', type: 'module' },
  { id: 'arena-cosmetic-epic', name: 'Arena Cosmetic (Epic)', type: 'cosmetic', rarity: 'epic' }
];

// Raid Shop (static + choir raid rotation)
const RAID_SHOP_STATIC = [
  { id: 'raid-module', name: 'Raid Module', type: 'module' },
  { id: 'legendary-shard', name: 'Legendary Shard', type: 'shard' },
  { id: 'ability-module', name: 'Ability Module', type: 'module' }
];
const RAID_SHOP_CHOIR_ROTATION = [
  { id: 'choir-resonance-module', name: 'Choir Resonance Module', type: 'module', rarity: 'epic' },
  { id: 'choir-commander-shard', name: 'Choir Commander Shard', type: 'shard' },
  { id: 'choir-ship-skin', name: 'Choir Ship Skin', type: 'cosmetic', rarity: 'epic' }
];

// Guild Shop (static)
const GUILD_SHOP_STATIC = [
  { id: 'guild-banner-skin', name: 'Guild Banner Skin', type: 'cosmetic' },
  { id: 'guild-emblem', name: 'Guild Emblem', type: 'cosmetic' },
  { id: 'guild-xp-booster', name: 'Guild XP Booster', type: 'booster' },
  { id: 'ability-module', name: 'Ability Module', type: 'module' },
  { id: 'seasonal-currency-small', name: 'Seasonal Currency (small)', type: 'currency' }
];

// Faction Shops (weekly rotation)
const FACTION_SHOP_ROTATION = [
  // Week 1: Choir
  [ { id: 'choir-faction', name: 'Choir Faction Shop', type: 'shop' } ],
  // Week 2: Riftborn
  [ { id: 'riftborn-faction', name: 'Riftborn Faction Shop', type: 'shop' } ],
  // Week 3: Wraithbound
  [ { id: 'wraithbound-faction', name: 'Wraithbound Faction Shop', type: 'shop' } ],
  // Week 4: All Factions (Mini-Event)
  [ { id: 'all-factions', name: 'All Factions Shop (Mini-Event)', type: 'shop' } ]
];
// --- End Season 1 Shop Rotations & Static Data ---

// --- Shop Utility Functions ---
function getSeason1Week() {
  // Season 1 starts on a fixed date (e.g., Feb 1, 2026)
  const seasonStart = new Date('2026-02-01T00:00:00Z');
  const now = new Date();
  const diffWeeks = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return Math.max(0, Math.min(diffWeeks, 7)); // 0-based, max 7 (8 weeks)
}
function getPrestigeRotation() {
  // 2-week rotation
  const seasonStart = new Date('2026-02-01T00:00:00Z');
  const now = new Date();
  const diffWeeks = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return diffWeeks % 2;
}
function getFactionShopWeek() {
  // 4-week rotation
  const seasonStart = new Date('2026-02-01T00:00:00Z');
  const now = new Date();
  const diffWeeks = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return diffWeeks % 4;
}

// --- Shop Endpoints ---

// --- Season 1 Event Reward Structures ---
const SEASON1_EVENTS = [
  {
    id: 'seasonal-boss',
    name: 'The Harmonic Sentinel',
    rewards: [
      { type: 'currency', id: 'seasonal-currency', name: 'Seasonal Currency', amount: 500 },
      { type: 'shard', id: 'choir-commander-shard', name: 'Choir Commander Shard', amount: 10 },
      { type: 'module', id: 'choir-module-epic', name: 'Choir Module', rarity: 'epic', amount: 1 },
      { type: 'cosmetic', id: 'profilebg_choirchamber', name: 'Profile Background: Choir Chamber', rarity: 'legendary' },
      { type: 'title', id: 'title_resonant', name: 'Title: Resonant' }
    ],
    leaderboard: [
      { type: 'currency', id: 'prestige-token', name: 'Prestige Tokens', amount: 100 },
      { type: 'shard', id: 'legendary-shard', name: 'Legendary Shard', amount: 5 },
      { type: 'cosmetic', id: 'mythic-cosmetic', name: 'Mythic Cosmetic', rarity: 'mythic', topPercent: 1 }
    ]
  },
  {
    id: 'legendary-hunt',
    name: 'Vor’Keth Ascendant',
    rewards: [
      { type: 'shard', id: 'vorketh-shard', name: 'Vor’Keth Shard', amount: 20 },
      { type: 'crystal', id: 'legendary-crystal', name: 'Legendary Crystal', amount: 2 },
      { type: 'currency', id: 'seasonal-key', name: 'Seasonal Key', amount: 10 },
      { type: 'module', id: 'ability-module', name: 'Ability Module', amount: 1 },
      { type: 'cosmetic', id: 'emote-ascendant-pulse', name: 'Mythic Emote: Ascendant Pulse', rarity: 'mythic' }
    ],
    milestones: [
      { type: 'shard', id: 'vorketh-shard', name: 'Vor’Keth Shard', amount: 100, milestone: 'final' },
      { type: 'shard', id: 'vorketh-shard', name: 'Vor’Keth Shard', amount: 10, milestone: 'premium+' }
    ]
  },
  {
    id: 'faction-invasion',
    name: 'Choir’s First Hymn',
    rewards: [
      { type: 'currency', id: 'faction-token', name: 'Faction Token', amount: 100 },
      { type: 'currency', id: 'seasonal-currency', name: 'Seasonal Currency', amount: 200 },
      { type: 'module', id: 'choir-module', name: 'Choir Module', amount: 1 },
      { type: 'cosmetic', id: 'choir-ship-skin', name: 'Choir Ship Skin', rarity: 'epic' }
    ]
  },
  {
    id: 'raid-spotlight',
    name: 'Harmonic Sentinel Raid',
    rewards: [
      { type: 'currency', id: 'raid-token', name: 'Raid Token', amount: 100 },
      { type: 'module', id: 'choir-raid-module', name: 'Choir Raid Module', rarity: 'epic', amount: 1 },
      { type: 'shard', id: 'legendary-shard', name: 'Legendary Shard', amount: 2 },
      { type: 'cosmetic', id: 'guild-cosmetic', name: 'Guild Cosmetic', rarity: 'epic' }
    ]
  },
  {
    id: 'pvp-season',
    name: 'Resonance Clash',
    rewards: [
      { type: 'currency', id: 'arena-token', name: 'Arena Token', amount: 100 },
      { type: 'currency', id: 'seasonal-key', name: 'Seasonal Key', amount: 5 },
      { type: 'cosmetic', id: 'pvp-cosmetic', name: 'PvP Cosmetic', rarity: 'epic' },
      { type: 'cosmetic', id: 'wraithbound-ship-skin', name: 'Wraithbound Ship Skin', rarity: 'epic' }
    ],
    leaderboard: [
      { type: 'title', id: 'title_clashborn', name: 'Title: Clashborn', topPercent: 1 }
    ]
  },
  {
    id: 'black-wave',
    name: 'The Starless Pulse',
    rewards: [
      { type: 'currency', id: 'seasonal-currency', name: 'Seasonal Currency', amount: 300 },
      { type: 'crystal', id: 'legendary-crystal', name: 'Legendary Crystal', amount: 1 },
      { type: 'module', id: 'seasonal-module', name: 'Seasonal Module', amount: 1 },
      { type: 'cosmetic', id: 'profileframe_blackwave', name: 'Mythic Profile Frame: Black Wave', rarity: 'mythic' },
      { type: 'title', id: 'title_starless', name: 'Title: Starless' }
    ]
  },
  {
    id: 'season-finale',
    name: 'Final Hymn',
    rewards: [
      { type: 'token', id: 'legendary-summon-token', name: 'Legendary Summon Token', amount: 1 },
      { type: 'currency', id: 'prestige-token', name: 'Prestige Token', amount: 100 },
      { type: 'cosmetic', id: 'final-hymn-frame', name: 'Mythic Cosmetic: Final Hymn Frame', rarity: 'mythic' },
      { type: 'badge', id: 'seasonal-completion-badge', name: 'Seasonal Completion Badge' },
      { type: 'story', id: 'final-chapter', name: 'Seasonal Story Unlock (Final Chapter)' }
    ]
  }
];

// ...existing code...

// --- Battle Pass Endpoints ---
// (All endpoints moved after router declaration)
// --- End Battle Pass Endpoints ---
// --- Summoning System Type Definitions ---
/**
 * SummonBanner: represents a summon banner available to the player
 */
type SummonBanner = {
  id: string;
  name: string;
  type: 'basic' | 'advanced' | 'legendary' | 'faction' | 'seasonal';
  featuredUnits: { id: string; name: string; rarity: 'rare' | 'epic' | 'legendary'; faction: string }[];
  cost: { currency: string; amount: number };
  multiCost?: { currency: string; amount: number };
  pity: {
    pullsUntilLegendaryShard?: number;
    pullsUntilLegendaryUnit?: number;
  };
  endsAt: string; // ISO timestamp
};

/**
 * SummonResultItem: represents a single result from a summon pull
 */
type SummonResultItem =
  | { type: 'commanderShard'; commanderId: string; amount: number; isNew?: boolean }
  | { type: 'commander'; commanderId: string; isNew: boolean }
  | { type: 'shipBlueprint'; shipId: string; amount: number; isNew?: boolean }
  | { type: 'module'; moduleId: string; rarity: string; isNew?: boolean };

/**
 * SummonResponse: returned by POST /summon/pull
 */
type SummonResponse = {
  bannerId: string;
  count: number;
  results: SummonResultItem[];
  currencies: Record<string, number>;
  pity: {
    pullsUntilLegendaryShard?: number;
    pullsUntilLegendaryUnit?: number;
  };
};

// --- End Summoning System Type Definitions ---
import express from 'express';
const router = express.Router();

// POST /api/battlepass/claim - Claim a reward for a specific tier and track
router.post('/battlepass/claim', (req, res) => {
  const { tierId, track } = req.body as { tierId: string; track: BattlePassTrackType };
  // Mock: grant rewards and mark as claimed
  const bp = { ...MOCK_BATTLEPASS_STATE };
  if (!bp.claimedRewards[tierId]) bp.claimedRewards[tierId] = [];
  if (!bp.claimedRewards[tierId].includes(track)) {
    bp.claimedRewards[tierId].push(track);
  }
  // Find rewards for the tier/track
  const tier = bp.tiers.find(t => t.id === tierId);
  let rewards: BattlePassReward[] = [];
  if (tier && tier.rewards[track]) rewards = tier.rewards[track]!;
  res.json({ battlePass: bp, rewards });
});

// POST /api/battlepass/claim-all - Claim all available rewards
router.post('/battlepass/claim-all', (req, res) => {
  const bp = { ...MOCK_BATTLEPASS_STATE };
  let allRewards: BattlePassReward[] = [];
  for (const tier of bp.tiers) {
    for (const track of ['free', 'premium', 'premiumPlus'] as BattlePassTrackType[]) {
      if (tier.rewards[track] && (!bp.claimedRewards[tier.id] || !bp.claimedRewards[tier.id].includes(track))) {
        if (!bp.claimedRewards[tier.id]) bp.claimedRewards[tier.id] = [];
        bp.claimedRewards[tier.id].push(track);
        allRewards = allRewards.concat(tier.rewards[track]!);
      }
    }
  }
  res.json({ battlePass: bp, rewards: allRewards });
});

// POST /api/battlepass/missions/:missionId/claim - Claim a mission reward
router.post('/battlepass/missions/:missionId/claim', (req, res) => {
  const { missionId } = req.params;
  // Mock: mark mission as claimed and grant XP
  const missions = MOCK_BATTLEPASS_MISSIONS.map(m => ({ ...m }));
  const mission = missions.find(m => m.id === missionId);
  if (mission && mission.isCompleted && !mission.isClaimed) {
    mission.isClaimed = true;
    // Optionally, update BP state (add XP, etc.)
  }
  res.json({ mission, battlePass: MOCK_BATTLEPASS_STATE });
});

// POST /api/battlepass/upgrade - Upgrade to premium or premiumPlus
router.post('/battlepass/upgrade', (req, res) => {
  const { track } = req.body as { track: BattlePassTrackType };
  // Mock: add track to ownedTracks
  const bp = { ...MOCK_BATTLEPASS_STATE };
  if (!bp.ownedTracks.includes(track)) bp.ownedTracks.push(track);
  res.json({ battlePass: bp });
});

// --- Battle Pass Endpoints ---
// GET /api/battlepass - Get current battle pass state
router.get('/battlepass', (req, res) => {
  res.json(MOCK_BATTLEPASS_STATE);
});

// GET /api/battlepass/missions - Get current battle pass missions
router.get('/battlepass/missions', (req, res) => {
  res.json(MOCK_BATTLEPASS_MISSIONS);
});
// --- End Battle Pass Endpoints ---
// ...router already declared at the top...
// In-memory active raids (replace with DB in production)
// --- Social System: Friends ---
// --- Social System: Chat ---
// --- Social System: Mail ---
// --- Advanced LiveOps: Flash Events & World Bosses ---
// --- Viral Growth: Referral System (Fleetmates Program) ---
// --- Viral Growth: Social Sharing Moments ---
// --- Spectator Mode: PvP & Raids ---
// --- Addiction-Loop: Daily Streak Rewards ---
// --- Addiction-Loop: Idle Rewards (Offline Progress) ---
// --- Social Stickiness: Friend Assist System ---
// --- Social Stickiness: Cross-Guild Events ---

// --- Retention: Collection Milestones System ---

// --- Retention: Commander Bond System ---

// --- Retention: Dynamic Difficulty Scaling ---

// --- Retention: Narrative Season Unlocks ---

// --- Analytics, Personalization, and A/B Testing ---

// --- Monetization: Ad Offers System ---

// --- Monetization: Login Calendar System ---

// --- Endgame: PvP Ladders, Guild Wars, Tournaments ---

// --- Quality-of-Life: Cloud Save, Notifications, Accessibility ---

// --- Content: Campaign, Achievements, Lore ---

// --- Platform/Ecosystem: Cross-Play, API, Integrations ---

// --- Public/SEO: Leaderboards, Profiles, Event Calendar ---

// --- Polish & Scale: Moderation, Support, Config, Real-Time, Localization, GDPR ---

// Chat Moderation (simple flag/report system)
const chatReports: { id: string; reporter: string; messageId: string; reason: string; ts: number }[] = [];
router.post('/moderation/report', (req, res) => {
  const { reporter, messageId, reason } = req.body;
  chatReports.push({ id: Math.random().toString(36).slice(2), reporter, messageId, reason, ts: Date.now() });
  res.json({ success: true });
});
router.get('/moderation/reports', (_req, res) => {
  res.json({ reports: chatReports });
});

// In-game Support/Ticketing
const supportTickets: { id: string; playerId: string; subject: string; message: string; status: 'open'|'closed'; ts: number }[] = [];
router.post('/support/ticket', (req, res) => {
  const { playerId, subject, message } = req.body;
  const id = Math.random().toString(36).slice(2);
  supportTickets.push({ id, playerId, subject, message, status: 'open', ts: Date.now() });
  res.json({ success: true, id });
});
router.get('/support/tickets', (req, res) => {
  const { playerId } = req.query;
  const tickets = supportTickets.filter(t => t.playerId === playerId);
  res.json({ tickets });
});
router.post('/support/close', (req, res) => {
  const { ticketId } = req.body;
  const t = supportTickets.find(t => t.id === ticketId);
  if (t) t.status = 'closed';
  res.json({ success: true });
});

// Remote Config (live tuning)
let remoteConfig: Record<string, any> = { dropRates: { legendary: 0.01 }, eventSchedule: [] };
router.get('/config', (_req, res) => {
  res.json({ config: remoteConfig });
});
router.post('/config/update', (req, res) => {
  const { key, value } = req.body;
  remoteConfig[key] = value;
  res.json({ success: true, config: remoteConfig });
});

// Real-Time Event Feed (websocket placeholder)
// (In production, use a websocket server. Here, just a pollable feed.)
let eventFeed: { id: string; type: string; data: any; ts: number }[] = [];
router.post('/eventfeed/push', (req, res) => {
  const { type, data } = req.body;
  eventFeed.push({ id: Math.random().toString(36).slice(2), type, data, ts: Date.now() });
  res.json({ success: true });
});
router.get('/eventfeed', (_req, res) => {
  res.json({ feed: eventFeed.slice(-50) });
});

// Localization/Multi-language
const localization: Record<string, Record<string, string>> = { en: {}, es: {}, fr: {} };
router.post('/localization/set', (req, res) => {
  const { lang, key, value } = req.body;
  if (!localization[lang]) localization[lang] = {};
  localization[lang][key] = value;
  res.json({ success: true });
});
router.get('/localization/:lang', (req, res) => {
  const { lang } = req.params;
  res.json({ strings: localization[lang] || {} });
});

// GDPR/Data Export
router.get('/gdpr/export', (req, res) => {
  const { playerId } = req.query;
  // Mock: export all player-related data
  res.json({ data: {
    profile: playerProfiles[playerId as string] || null,
    cloudSave: playerCloudSaves[playerId as string] || null,
    achievements: achievements.filter(a => a.achievedBy.has(playerId as string)),
    tickets: supportTickets.filter(t => t.playerId === playerId),
    notifications: playerNotifications[playerId as string] || null,
    accessibility: playerAccessibility[playerId as string] || null
  }});
});
// Public Leaderboard (top 100 PvP)
router.get('/public/leaderboard', (_req, res) => {
  res.json({ leaderboard: pvpLadder.slice(0, 100) });
});

// Public Player Profile
const playerProfiles: Record<string, { name: string; guild?: string; power: number; avatar?: string }> = {};
router.get('/public/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  const profile = playerProfiles[playerId];
  if (!profile) return res.status(404).json({ error: 'Player not found' });
  res.json({ profile });
});

// Public Guild Profile
const guildProfiles: Record<string, { name: string; members: string[]; power: number; banner?: string }> = {};
router.get('/public/guild/:guildId', (req, res) => {
  const { guildId } = req.params;
  const profile = guildProfiles[guildId];
  if (!profile) return res.status(404).json({ error: 'Guild not found' });
  res.json({ profile });
});

// Public Event Calendar
const eventCalendar: { id: string; name: string; start: number; end: number; desc: string }[] = [
  { id: 'event1', name: 'Legendary Hunt', start: 1760000000000, end: 1760086400000, desc: 'Hunt for legendary commanders!' },
  { id: 'event2', name: 'Guild War Finals', start: 1760200000000, end: 1760286400000, desc: 'Top guilds battle for glory.' }
];
router.get('/public/events', (_req, res) => {
  res.json({ events: eventCalendar });
});
const playerPlatforms: Record<string, { platforms: string[] }> = {};
const apiKeys: Record<string, string> = {};
const thirdPartyLinks: Record<string, { discord?: string; twitch?: string }> = {};

// POST /api/platform/register - Register player platform
router.post('/platform/register', (req, res) => {
  const { playerId, platform } = req.body;
  if (!playerPlatforms[playerId]) playerPlatforms[playerId] = { platforms: [] };
  if (!playerPlatforms[playerId].platforms.includes(platform)) playerPlatforms[playerId].platforms.push(platform);
  res.json({ success: true, platforms: playerPlatforms[playerId].platforms });
});

// GET /api/platform/status - Get player platforms
router.get('/platform/status', (req, res) => {
  const { playerId } = req.query;
  res.json({ platforms: playerPlatforms[playerId as string]?.platforms || [] });
});

// POST /api/api/register - Register public API key
router.post('/api/api/register', (req, res) => {
  const { playerId } = req.body;
  const key = Math.random().toString(36).slice(2);
  apiKeys[playerId] = key;
  res.json({ success: true, apiKey: key });
});

// GET /api/api/key - Get public API key
router.get('/api/api/key', (req, res) => {
  const { playerId } = req.query;
  res.json({ apiKey: apiKeys[playerId as string] || null });
});

// POST /api/integration/link - Link third-party account
router.post('/integration/link', (req, res) => {
  const { playerId, discord, twitch } = req.body;
  if (!thirdPartyLinks[playerId]) thirdPartyLinks[playerId] = {};
  if (discord) thirdPartyLinks[playerId].discord = discord;
  if (twitch) thirdPartyLinks[playerId].twitch = twitch;
  res.json({ success: true, links: thirdPartyLinks[playerId] });
});

// GET /api/integration/status - Get third-party links
router.get('/integration/status', (req, res) => {
  const { playerId } = req.query;
  res.json({ links: thirdPartyLinks[playerId as string] || {} });
});
type CampaignStage = { id: string; name: string; completedBy: Set<string> };
const campaignStages: CampaignStage[] = [
  { id: 'stage1', name: 'Prologue', completedBy: new Set() },
  { id: 'stage2', name: 'First Contact', completedBy: new Set() },
  { id: 'stage3', name: 'The Rift', completedBy: new Set() }
];

// POST /api/campaign/complete - Mark campaign stage as completed
router.post('/campaign/complete', (req, res) => {
  const { playerId, stageId } = req.body;
  const stage = campaignStages.find(s => s.id === stageId);
  if (!stage) return res.status(404).json({ error: 'Stage not found' });
  stage.completedBy.add(playerId);
  res.json({ success: true });
});

// GET /api/campaign/status - Get campaign progress for player
router.get('/campaign/status', (req, res) => {
  const { playerId } = req.query;
  const progress = campaignStages.map(s => ({ id: s.id, name: s.name, completed: s.completedBy.has(playerId as string) }));
  res.json({ progress });
});

// --- Achievements ---
type Achievement = { id: string; name: string; desc: string; reward: any; achievedBy: Set<string> };
const achievements: Achievement[] = [
  { id: 'achv1', name: 'First Blood', desc: 'Win your first battle', reward: { gems: 50 }, achievedBy: new Set() },
  { id: 'achv2', name: 'Fleet Commander', desc: 'Unlock 5 commanders', reward: { skin: 'special' }, achievedBy: new Set() }
];

// POST /api/achievement/claim - Claim achievement
router.post('/achievement/claim', (req, res) => {
  const { playerId, achievementId } = req.body;
  const achv = achievements.find(a => a.id === achievementId);
  if (!achv) return res.status(404).json({ error: 'Achievement not found' });
  if (achv.achievedBy.has(playerId)) return res.status(400).json({ error: 'Already claimed' });
  achv.achievedBy.add(playerId);
  res.json({ success: true, reward: achv.reward });
});

// GET /api/achievement/status - Get achievement status for player
router.get('/achievement/status', (req, res) => {
  const { playerId } = req.query;
  const status = achievements.map(a => ({ id: a.id, name: a.name, achieved: a.achievedBy.has(playerId as string), reward: a.reward }));
  res.json({ status });
});

// --- Lore ---
const loreEntries: { id: string; title: string; text: string }[] = [
  { id: 'lore1', title: 'The Great Exodus', text: 'Humanity fled the dying Earth...' },
  { id: 'lore2', title: 'The Spectral Fleet', text: 'Legends speak of ghostly ships...' }
];

// GET /api/lore - Get all lore entries
router.get('/lore', (_req, res) => {
  res.json({ lore: loreEntries });
});
const playerCloudSaves: Record<string, any> = {};
const playerNotifications: Record<string, { enabled: boolean; channels: string[] }> = {};
const playerAccessibility: Record<string, { colorblind: boolean; textScale: number; audioCues: boolean }> = {};

// POST /api/cloudsave/save - Save player data to cloud
router.post('/cloudsave/save', (req, res) => {
  const { playerId, data } = req.body;
  playerCloudSaves[playerId] = data;
  res.json({ success: true });
});

// GET /api/cloudsave/load - Load player data from cloud
router.get('/cloudsave/load', (req, res) => {
  const { playerId } = req.query;
  res.json({ data: playerCloudSaves[playerId as string] || null });
});

// POST /api/notifications/settings - Set notification preferences
router.post('/notifications/settings', (req, res) => {
  const { playerId, enabled, channels } = req.body;
  playerNotifications[playerId] = { enabled, channels };
  res.json({ success: true });
});

// GET /api/notifications/settings - Get notification preferences
router.get('/notifications/settings', (req, res) => {
  const { playerId } = req.query;
  res.json({ settings: playerNotifications[playerId as string] || { enabled: false, channels: [] } });
});

// POST /api/accessibility/settings - Set accessibility options
router.post('/accessibility/settings', (req, res) => {
  const { playerId, colorblind, textScale, audioCues } = req.body;
  playerAccessibility[playerId] = { colorblind, textScale, audioCues };
  res.json({ success: true });
});

// GET /api/accessibility/settings - Get accessibility options
router.get('/accessibility/settings', (req, res) => {
  const { playerId } = req.query;
  res.json({ settings: playerAccessibility[playerId as string] || { colorblind: false, textScale: 1, audioCues: false } });
});
type PvPLadderEntry = { playerId: string; rank: number; points: number };
let pvpLadder: PvPLadderEntry[] = [];

// POST /api/pvp/ladder/report - Report PvP match result
router.post('/pvp/ladder/report', (req, res) => {
  const { playerId, points } = req.body;
  let entry = pvpLadder.find(e => e.playerId === playerId);
  if (!entry) {
    entry = { playerId, rank: pvpLadder.length + 1, points: 0 };
    pvpLadder.push(entry);
  }
  entry.points += points;
  pvpLadder.sort((a, b) => b.points - a.points);
  pvpLadder.forEach((e, i) => (e.rank = i + 1));
  res.json({ success: true, rank: entry.rank, points: entry.points });
});

// GET /api/pvp/ladder - Get PvP ladder
router.get('/pvp/ladder', (_req, res) => {
  res.json({ ladder: pvpLadder.slice(0, 100) });
});

// --- Guild Wars ---
type GuildWar = { id: string; guilds: string[]; status: 'pending' | 'active' | 'completed'; winner?: string };
let guildWars: GuildWar[] = [];

// POST /api/guildwar/register - Register a guild war
router.post('/guildwar/register', (req, res) => {
  const { guilds } = req.body;
  const id = Math.random().toString(36).slice(2);
  guildWars.push({ id, guilds, status: 'pending' });
  res.json({ success: true, id });
});

// POST /api/guildwar/start - Start a guild war
router.post('/guildwar/start', (req, res) => {
  const { warId } = req.body;
  const war = guildWars.find(w => w.id === warId);
  if (!war) return res.status(404).json({ error: 'War not found' });
  war.status = 'active';
  res.json({ success: true });
});

// POST /api/guildwar/complete - Complete a guild war
router.post('/guildwar/complete', (req, res) => {
  const { warId, winner } = req.body;
  const war = guildWars.find(w => w.id === warId);
  if (!war) return res.status(404).json({ error: 'War not found' });
  war.status = 'completed';
  war.winner = winner;
  res.json({ success: true });
});

// GET /api/guildwar/status - Get all guild wars
router.get('/guildwar/status', (_req, res) => {
  res.json({ wars: guildWars });
});

// --- Tournaments ---
type Tournament = { id: string; name: string; status: 'upcoming' | 'active' | 'completed'; participants: string[]; winner?: string };
let tournaments: Tournament[] = [];

// POST /api/tournament/register - Register a tournament
router.post('/tournament/register', (req, res) => {
  const { name, participants } = req.body;
  const id = Math.random().toString(36).slice(2);
  tournaments.push({ id, name, status: 'upcoming', participants });
  res.json({ success: true, id });
});

// POST /api/tournament/start - Start a tournament
router.post('/tournament/start', (req, res) => {
  const { tournamentId } = req.body;
  const t = tournaments.find(t => t.id === tournamentId);
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  t.status = 'active';
  res.json({ success: true });
});

// POST /api/tournament/complete - Complete a tournament
router.post('/tournament/complete', (req, res) => {
  const { tournamentId, winner } = req.body;
  const t = tournaments.find(t => t.id === tournamentId);
  if (!t) return res.status(404).json({ error: 'Tournament not found' });
  t.status = 'completed';
  t.winner = winner;
  res.json({ success: true });
});

// GET /api/tournament/status - Get all tournaments
router.get('/tournament/status', (_req, res) => {
  res.json({ tournaments });
});
type CalendarType = 'daily' | 'weekly' | 'event';
const loginCalendars: Record<CalendarType, { days: number; rewards: any[] }> = {
  daily: { days: 7, rewards: [ {gems: 10}, {energy: 5}, {gems: 20}, {skip: 1}, {gems: 30}, {energy: 10}, {legendary: 1} ] },
  weekly: { days: 4, rewards: [ {gems: 50}, {skin: 'random'}, {energy: 20}, {legendary: 1} ] },
  event: { days: 3, rewards: [ {gems: 100}, {cosmetic: 'event'}, {legendary: 1} ] }
};
const playerCalendars: Record<string, Record<CalendarType, { lastClaim: number; day: number; claimed: Set<number> }>> = {};

// POST /api/calendar/claim - Claim login calendar reward
router.post('/calendar/claim', (req, res) => {
  const { playerId, type } = req.body;
  if (!playerCalendars[playerId]) playerCalendars[playerId] = { daily: { lastClaim: 0, day: 0, claimed: new Set() }, weekly: { lastClaim: 0, day: 0, claimed: new Set() }, event: { lastClaim: 0, day: 0, claimed: new Set() } };
  const now = Date.now();
  const calendar = playerCalendars[playerId][type];
  if (calendar.claimed.has(calendar.day)) return res.status(400).json({ error: 'Already claimed today' });
  calendar.lastClaim = now;
  calendar.claimed.add(calendar.day);
  const reward = loginCalendars[type].rewards[calendar.day];
  calendar.day = (calendar.day + 1) % loginCalendars[type].days;
  res.json({ success: true, reward, nextDay: calendar.day });
});

// GET /api/calendar/status - Get player login calendar progress
router.get('/calendar/status', (req, res) => {
  const { playerId } = req.query;
  const data = playerCalendars[playerId as string] || { daily: { lastClaim: 0, day: 0, claimed: new Set() }, weekly: { lastClaim: 0, day: 0, claimed: new Set() }, event: { lastClaim: 0, day: 0, claimed: new Set() } };
  res.json({ calendars: data });
});
const playerAds: Record<string, { rewarded: number; interstitial: number; offerwall: number }> = {};

// POST /api/ad/rewarded - Claim rewarded video ad reward
router.post('/ad/rewarded', (req, res) => {
  const { playerId } = req.body;
  if (!playerAds[playerId]) playerAds[playerId] = { rewarded: 0, interstitial: 0, offerwall: 0 };
  playerAds[playerId].rewarded++;
  // Example reward: 20 gems per ad
  res.json({ success: true, reward: { gems: 20 }, total: playerAds[playerId].rewarded });
});

// POST /api/ad/interstitial - Log interstitial ad view
router.post('/ad/interstitial', (req, res) => {
  const { playerId } = req.body;
  if (!playerAds[playerId]) playerAds[playerId] = { rewarded: 0, interstitial: 0, offerwall: 0 };
  playerAds[playerId].interstitial++;
  // No direct reward, just log
  res.json({ success: true, total: playerAds[playerId].interstitial });
});

// POST /api/ad/offerwall - Claim offerwall ad reward
router.post('/ad/offerwall', (req, res) => {
  const { playerId, offerId } = req.body;
  if (!playerAds[playerId]) playerAds[playerId] = { rewarded: 0, interstitial: 0, offerwall: 0 };
  playerAds[playerId].offerwall++;
  // Example: reward based on offerId (mock)
  const reward = offerId === 'big_offer' ? { gems: 200 } : { gems: 50 };
  res.json({ success: true, reward, total: playerAds[playerId].offerwall });
});

// GET /api/ad/status - Get ad view stats for player
router.get('/ad/status', (req, res) => {
  const { playerId } = req.query;
  const stats = playerAds[playerId as string] || { rewarded: 0, interstitial: 0, offerwall: 0 };
  res.json({ stats });
});
const analyticsEvents: any[] = [];
const playerSegments: Record<string, string> = {};
const abTestGroups: Record<string, string> = {};

// POST /api/analytics/log - Log analytics event
router.post('/analytics/log', (req, res) => {
  const { playerId, event, data } = req.body;
  analyticsEvents.push({ playerId, event, data, ts: Date.now() });
  res.json({ success: true });
});

// POST /api/personalization/segment - Set player segment
router.post('/personalization/segment', (req, res) => {
  const { playerId, segment } = req.body;
  playerSegments[playerId] = segment;
  res.json({ success: true });
});

// GET /api/personalization/segment - Get player segment
router.get('/personalization/segment', (req, res) => {
  const { playerId } = req.query;
  res.json({ segment: playerSegments[playerId as string] || 'default' });
});

// POST /api/abtest/assign - Assign player to A/B test group
router.post('/abtest/assign', (req, res) => {
  const { playerId, testId, groups } = req.body;
  if (!abTestGroups[playerId]) {
    // Assign randomly
    abTestGroups[playerId] = groups[Math.floor(Math.random() * groups.length)];
  }
  res.json({ group: abTestGroups[playerId] });
});

// GET /api/abtest/group - Get player's A/B test group
router.get('/abtest/group', (req, res) => {
  const { playerId } = req.query;
  res.json({ group: abTestGroups[playerId as string] || null });
});
type Season = { id: string; name: string; chapters: number; rewards: any[] };
const seasons: Season[] = [
  { id: 'season1', name: 'Rise of Legends', chapters: 5, rewards: [{ gems: 100 }, { skin: 'Arthur' }, { legendary: 1 }, { gems: 200 }, { mount: 'Pegasus' }] },
  { id: 'season2', name: 'Shadow War', chapters: 4, rewards: [{ gems: 150 }, { skin: 'Merlin' }, { legendary: 1 }, { mount: 'Griffin' }] },
];
const playerSeasons: Record<string, { [seasonId: string]: { unlocked: number; claimed: Set<number> } }> = {};

// POST /api/season/progress - Advance player in season
router.post('/season/progress', (req, res) => {
  const { playerId, seasonId } = req.body;
  if (!playerSeasons[playerId]) playerSeasons[playerId] = {};
  if (!playerSeasons[playerId][seasonId]) playerSeasons[playerId][seasonId] = { unlocked: 0, claimed: new Set() };
  playerSeasons[playerId][seasonId].unlocked = Math.min(playerSeasons[playerId][seasonId].unlocked + 1, seasons.find(s => s.id === seasonId)?.chapters || 0);
  res.json({ success: true, unlocked: playerSeasons[playerId][seasonId].unlocked });
});

// GET /api/season/status - Get player season progress
router.get('/season/status', (req, res) => {
  const { playerId, seasonId } = req.query;
  const season = seasons.find(s => s.id === seasonId);
  if (!season) return res.status(404).json({ error: 'Season not found' });
  const data = (playerSeasons[playerId as string] && playerSeasons[playerId as string][seasonId as string]) || { unlocked: 0, claimed: new Set() };
  const chapters = Array.from({ length: season.chapters }, (_, i) => ({
    chapter: i + 1,
    unlocked: i < data.unlocked,
    claimed: data.claimed.has(i),
    reward: season.rewards[i],
  }));
  res.json({ chapters });
});

// POST /api/season/claim - Claim season chapter reward
router.post('/season/claim', (req, res) => {
  const { playerId, seasonId, chapter } = req.body;
  const season = seasons.find(s => s.id === seasonId);
  if (!season) return res.status(404).json({ error: 'Season not found' });
  if (!playerSeasons[playerId] || !playerSeasons[playerId][seasonId]) return res.status(400).json({ error: 'No progress' });
  if (chapter > playerSeasons[playerId][seasonId].unlocked) return res.status(400).json({ error: 'Chapter not unlocked' });
  if (playerSeasons[playerId][seasonId].claimed.has(chapter - 1)) return res.status(400).json({ error: 'Already claimed' });
  playerSeasons[playerId][seasonId].claimed.add(chapter - 1);
  res.json({ success: true, reward: season.rewards[chapter - 1] });
});
const playerDifficulty: Record<string, { level: number; lastPerformance: number[] }> = {};

// POST /api/difficulty/report - Report player performance (win/loss, score)
router.post('/difficulty/report', (req, res) => {
  const { playerId, result, score } = req.body;
  if (!playerDifficulty[playerId]) playerDifficulty[playerId] = { level: 1, lastPerformance: [] };
  playerDifficulty[playerId].lastPerformance.push(result === 'win' ? 1 : 0);
  if (playerDifficulty[playerId].lastPerformance.length > 10) playerDifficulty[playerId].lastPerformance.shift();
  // Adjust difficulty: if win rate > 70%, increase; if < 30%, decrease
  const winRate = playerDifficulty[playerId].lastPerformance.reduce((a, b) => a + b, 0) / playerDifficulty[playerId].lastPerformance.length;
  if (winRate > 0.7) playerDifficulty[playerId].level = Math.min(playerDifficulty[playerId].level + 1, 10);
  if (winRate < 0.3) playerDifficulty[playerId].level = Math.max(playerDifficulty[playerId].level - 1, 1);
  res.json({ success: true, difficulty: playerDifficulty[playerId].level });
});

// GET /api/difficulty/level - Get player difficulty level
router.get('/difficulty/level', (req, res) => {
  const { playerId } = req.query;
  const level = playerDifficulty[playerId as string]?.level || 1;
  res.json({ level });
});
type CommanderBond = { pair: [string, string]; requiredBattles: number; reward: any };
const commanderBonds: CommanderBond[] = [
  { pair: ['Arthur', 'Merlin'], requiredBattles: 20, reward: { synergy: 1 } },
  { pair: ['Caesar', 'Cleopatra'], requiredBattles: 15, reward: { gems: 200 } },
];
const playerBonds: Record<string, { [pairKey: string]: { battles: number; claimed: boolean } }> = {};

function getPairKey(a: string, b: string) {
  return [a, b].sort().join('-');
}

// POST /api/bond/progress - Add battle to commander bond
router.post('/bond/progress', (req, res) => {
  const { playerId, commanderA, commanderB } = req.body;
  if (!playerBonds[playerId]) playerBonds[playerId] = {};
  const key = getPairKey(commanderA, commanderB);
  if (!playerBonds[playerId][key]) playerBonds[playerId][key] = { battles: 0, claimed: false };
  playerBonds[playerId][key].battles++;
  res.json({ success: true, battles: playerBonds[playerId][key].battles });
});

// GET /api/bond/status - Get all bond progress for player
router.get('/bond/status', (req, res) => {
  const { playerId } = req.query;
  const bonds = commanderBonds.map(bond => {
    const key = getPairKey(bond.pair[0], bond.pair[1]);
    const data = (playerBonds[playerId as string] && playerBonds[playerId as string][key]) || { battles: 0, claimed: false };
    return { ...bond, progress: data.battles, claimed: data.claimed, achieved: data.battles >= bond.requiredBattles };
  });
  res.json({ bonds });
});

// POST /api/bond/claim - Claim bond reward
router.post('/bond/claim', (req, res) => {
  const { playerId, commanderA, commanderB } = req.body;
  const key = getPairKey(commanderA, commanderB);
  const bond = commanderBonds.find(b => getPairKey(b.pair[0], b.pair[1]) === key);
  if (!bond) return res.status(404).json({ error: 'Bond not found' });
  if (!playerBonds[playerId] || !playerBonds[playerId][key]) return res.status(400).json({ error: 'No progress' });
  if (playerBonds[playerId][key].claimed) return res.status(400).json({ error: 'Already claimed' });
  if (playerBonds[playerId][key].battles < bond.requiredBattles) return res.status(400).json({ error: 'Not achieved' });
  playerBonds[playerId][key].claimed = true;
  res.json({ success: true, reward: bond.reward });
});
type CollectionMilestone = { id: string; required: number; reward: any };
const collectionMilestones: CollectionMilestone[] = [
  { id: 'collector_10', required: 10, reward: { gems: 100 } },
  { id: 'collector_25', required: 25, reward: { gems: 300 } },
  { id: 'collector_50', required: 50, reward: { legendary: 1 } },
];
const playerCollections: Record<string, { owned: Set<string>; claimed: Set<string> }> = {};

// POST /api/collection/add - Add item to player collection
router.post('/collection/add', (req, res) => {
  const { playerId, itemId } = req.body;
  if (!playerCollections[playerId]) playerCollections[playerId] = { owned: new Set(), claimed: new Set() };
  playerCollections[playerId].owned.add(itemId);
  res.json({ success: true, owned: Array.from(playerCollections[playerId].owned) });
});

// GET /api/collection/progress - Get player collection progress
router.get('/collection/progress', (req, res) => {
  const { playerId } = req.query;
  const data = playerCollections[playerId as string] || { owned: new Set(), claimed: new Set() };
  const ownedCount = data.owned.size;
  const milestones = collectionMilestones.map(m => ({ ...m, achieved: ownedCount >= m.required, claimed: data.claimed.has(m.id) }));
  res.json({ ownedCount, milestones });
});

// POST /api/collection/claim - Claim collection milestone reward
router.post('/collection/claim', (req, res) => {
  const { playerId, milestoneId } = req.body;
  if (!playerCollections[playerId]) return res.status(400).json({ error: 'No collection' });
  const milestone = collectionMilestones.find(m => m.id === milestoneId);
  if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
  if (playerCollections[playerId].claimed.has(milestoneId)) return res.status(400).json({ error: 'Already claimed' });
  if (playerCollections[playerId].owned.size < milestone.required) return res.status(400).json({ error: 'Not achieved' });
  playerCollections[playerId].claimed.add(milestoneId);
  res.json({ success: true, reward: milestone.reward });
});
type CrossGuildEvent = { id: string; guilds: string[]; type: 'MegaBoss' | 'Invasion' | 'Anomaly'; start: number; end: number; status: 'upcoming' | 'active' | 'completed' };
let crossGuildEvents: CrossGuildEvent[] = [];

// POST /api/crossguild/event/register - Register a cross-guild event
router.post('/crossguild/event/register', (req, res) => {
  const { guilds, type, start, end } = req.body;
  const id = Math.random().toString(36).slice(2);
  crossGuildEvents.push({ id, guilds, type, start, end, status: 'upcoming' });
  res.json({ success: true, id });
});

// POST /api/crossguild/event/start - Start a cross-guild event
router.post('/crossguild/event/start', (req, res) => {
  const { eventId } = req.body;
  const event = crossGuildEvents.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  event.status = 'active';
  res.json({ success: true });
});

// POST /api/crossguild/event/complete - Complete a cross-guild event
router.post('/crossguild/event/complete', (req, res) => {
  const { eventId } = req.body;
  const event = crossGuildEvents.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  event.status = 'completed';
  res.json({ success: true });
});

// GET /api/crossguild/event/status - Get all cross-guild events
router.get('/crossguild/event/status', (_req, res) => {
  res.json({ events: crossGuildEvents });
});
let friendAssists: { [userId: string]: { sent: string[]; received: string[] } } = {};

// POST /api/friend/assist/send - Send assist (energy, raid, mission, XP)
router.post('/friend/assist/send', (req, res) => {
  const { from, to, type } = req.body; // type: 'energy' | 'raid' | 'mission' | 'xp'
  if (from === to) return res.status(400).json({ error: 'Cannot assist yourself' });
  if (!friendAssists[from]) friendAssists[from] = { sent: [], received: [] };
  if (!friendAssists[to]) friendAssists[to] = { sent: [], received: [] };
  if (friendAssists[from].sent.includes(to)) return res.status(400).json({ error: 'Already assisted today' });
  friendAssists[from].sent.push(to);
  friendAssists[to].received.push(from);
  res.json({ success: true });
});

// GET /api/friend/assist/status - Get assist status
router.get('/friend/assist/status', (req, res) => {
  const userId = req.query.userId as string;
  const sent = friendAssists[userId]?.sent || [];
  const received = friendAssists[userId]?.received || [];
  res.json({ sent, received });
});
let userIdle: Record<string, { lastClaim: number }> = {};
const idleRates = { credits: 100, alloy: 10, data: 5, seasonal: 1 }; // per hour
const idleMaxHours = 24;

// POST /api/idle/claim - Claim idle rewards
router.post('/idle/claim', (req, res) => {
  const { userId } = req.body;
  const now = Date.now();
  let user = userIdle[userId];
  if (!user) user = userIdle[userId] = { lastClaim: now };
  const elapsed = Math.min((now - user.lastClaim) / (60 * 60 * 1000), idleMaxHours);
  if (elapsed < 1) return res.status(400).json({ error: 'Not enough idle time' });
  user.lastClaim = now;
  const rewards = Object.entries(idleRates).map(([type, rate]) => ({ type, amount: Math.floor(rate * elapsed) }));
  res.json({ success: true, hours: elapsed, rewards });
});
let userStreaks: Record<string, { streak: number; lastClaim: number; month: number }> = {};
const streakRewards = [
  { day: 1, reward: { type: 'credits', amount: 1000 } },
  { day: 7, reward: { type: 'summonToken', amount: 5 } },
  { day: 14, reward: { type: 'legendaryShard', amount: 1 } },
  { day: 30, reward: { type: 'cosmetic', cosmeticId: 'exclusive-streak' } }
];

// POST /api/streak/claim - Claim daily streak reward
router.post('/streak/claim', (req, res) => {
  const { userId } = req.body;
  const now = Date.now();
  const month = new Date(now).getMonth();
  let user = userStreaks[userId];
  if (!user || user.month !== month) user = userStreaks[userId] = { streak: 0, lastClaim: 0, month };
  const oneDay = 24 * 60 * 60 * 1000;
  if (now - user.lastClaim < oneDay) return res.status(400).json({ error: 'Already claimed today' });
  if (now - user.lastClaim > 2 * oneDay) user.streak = 0; // Grace period: 1 day
  user.streak += 1;
  user.lastClaim = now;
  user.month = month;
  // Find highest reward for current streak
  let reward = streakRewards.slice().reverse().find(r => user.streak >= r.day)?.reward || { type: 'credits', amount: 500 };
  res.json({ success: true, streak: user.streak, reward });
});
type Replay = { id: string; type: 'PvP' | 'Raid'; data: any; timestamp: number };
let replays: Replay[] = [];
let liveMatches: { id: string; type: 'PvP' | 'Raid'; participants: string[]; viewers: string[]; start: number }[] = [];

// POST /api/spectate/replay/save - Save a match replay
router.post('/spectate/replay/save', (req, res) => {
  const { type, data } = req.body;
  const id = Math.random().toString(36).slice(2);
  replays.push({ id, type, data, timestamp: Date.now() });
  res.json({ success: true, id });
});

// GET /api/spectate/replay/:id - Get a match replay
router.get('/spectate/replay/:id', (req, res) => {
  const replay = replays.find(r => r.id === req.params.id);
  if (!replay) return res.status(404).json({ error: 'Replay not found' });
  res.json({ replay });
});

// POST /api/spectate/live/register - Register a live match (PvP or Raid)
router.post('/spectate/live/register', (req, res) => {
  const { type, participants } = req.body;
  const id = Math.random().toString(36).slice(2);
  liveMatches.push({ id, type, participants, viewers: [], start: Date.now() });
  res.json({ success: true, id });
});

// POST /api/spectate/live/join - Join a live match as spectator
router.post('/spectate/live/join', (req, res) => {
  const { matchId, userId } = req.body;
  const match = liveMatches.find(m => m.id === matchId);
  if (!match) return res.status(404).json({ error: 'Match not found' });
  if (!match.viewers.includes(userId)) match.viewers.push(userId);
  res.json({ success: true });
});

// GET /api/spectate/live/:id - Get live match info
router.get('/spectate/live/:id', (req, res) => {
  const match = liveMatches.find(m => m.id === req.params.id);
  if (!match) return res.status(404).json({ error: 'Match not found' });
  res.json({ match });
});
// POST /api/share/moment - Generate a shareable moment (legendary unlock, PvP win, etc.)
router.post('/share/moment', (req, res) => {
  const { userId, type, data } = req.body;
  // Example: type = 'legendaryUnlock', 'pvpWin', 'raidDamage', 'skinUnlock', 'seasonComplete'
  // data = { commander, skin, damage, rank, etc. }
  // Generate a shareable payload (could be a URL, JSON, or image in production)
  const payload = {
    player: userId,
    type,
    data,
    timestamp: Date.now(),
    shareUrl: `https://game.example.com/share/${type}/${userId}/${Date.now()}`
  };
  res.json({ success: true, payload });
});
type Referral = { code: string; inviter: string; invitee?: string; accepted: boolean; rewardsClaimed: boolean; timestamp: number };
let referrals: Referral[] = [];
let referralMilestones = [1, 3, 5, 10]; // Example milestones

// POST /api/referral/generate - Generate a referral code
router.post('/referral/generate', (req, res) => {
  const { userId } = req.body;
  const code = Math.random().toString(36).slice(2, 10);
  referrals.push({ code, inviter: userId, accepted: false, rewardsClaimed: false, timestamp: Date.now() });
  res.json({ code });
});

// POST /api/referral/accept - Accept a referral code
router.post('/referral/accept', (req, res) => {
  const { code, invitee } = req.body;
  const ref = referrals.find(r => r.code === code && !r.accepted);
  if (!ref) return res.status(404).json({ error: 'Invalid or already used code' });
  ref.invitee = invitee;
  ref.accepted = true;
  res.json({ success: true });
});

// GET /api/referral/status - Get referral status and rewards
router.get('/referral/status', (req, res) => {
  const userId = req.query.userId as string;
  const sent = referrals.filter(r => r.inviter === userId);
  const received = referrals.filter(r => r.invitee === userId);
  // Example rewards: tokens, cosmetics, shards at milestones
  const milestone = referralMilestones.filter(m => sent.filter(r => r.accepted).length >= m).pop() || 0;
  res.json({ sent, received, milestone });
});

// POST /api/referral/claim - Claim milestone rewards
router.post('/referral/claim', (req, res) => {
  const { userId } = req.body;
  const sent = referrals.filter(r => r.inviter === userId && r.accepted && !r.rewardsClaimed);
  let rewards: any[] = [];
  for (const r of sent) {
    r.rewardsClaimed = true;
    rewards.push({ type: 'summonToken', amount: 10 }); // Example reward
  }
  res.json({ success: true, rewards });
});
type LiveEvent = { id: string; name: string; type: 'Flash' | 'WorldBoss' | 'Special'; start: number; end: number; details?: any };
let liveEvents: LiveEvent[] = [];

// POST /api/liveops/events/schedule - Schedule a new event (admin)
router.post('/liveops/events/schedule', (req, res) => {
  const { name, type, start, end, details } = req.body;
  const event: LiveEvent = { id: Math.random().toString(36).slice(2), name, type, start, end, details };
  liveEvents.push(event);
  res.json({ success: true, event });
});

// GET /api/liveops/events/active - Get currently active events
router.get('/liveops/events/active', (_req, res) => {
  const now = Date.now();
  const active = liveEvents.filter(e => e.start <= now && e.end >= now);
  res.json({ active });
});

// GET /api/liveops/events/upcoming - Get upcoming events
router.get('/liveops/events/upcoming', (_req, res) => {
  const now = Date.now();
  const upcoming = liveEvents.filter(e => e.start > now).sort((a, b) => a.start - b.start);
  res.json({ upcoming });
});

// POST /api/liveops/events/delete - Delete an event (admin)
router.post('/liveops/events/delete', (req, res) => {
  const { eventId } = req.body;
  liveEvents = liveEvents.filter(e => e.id !== eventId);
  res.json({ success: true });
});
type Mail = { id: string; to: string; from: string; subject: string; body: string; attachments?: any[]; read: boolean; timestamp: number };
let userMail: Record<string, Mail[]> = {};

// GET /api/social/mail - Get inbox
router.get('/social/mail', (req, res) => {
  const userId = req.query.userId as string;
  let inbox = userMail[userId] || [];
  res.json({ inbox });
});

// POST /api/social/mail/send - Send mail (admin, system, or player)
router.post('/social/mail/send', (req, res) => {
  const { to, from, subject, body, attachments } = req.body;
  const mail: Mail = { id: Math.random().toString(36).slice(2), to, from, subject, body, attachments, read: false, timestamp: Date.now() };
  if (!userMail[to]) userMail[to] = [];
  userMail[to].push(mail);
  res.json({ success: true, mail });
});

// POST /api/social/mail/read - Mark mail as read
router.post('/social/mail/read', (req, res) => {
  const { userId, mailId } = req.body;
  let inbox = userMail[userId] || [];
  const mail = inbox.find(m => m.id === mailId);
  if (mail) mail.read = true;
  res.json({ success: true });
});

// POST /api/social/mail/delete - Delete mail
router.post('/social/mail/delete', (req, res) => {
  const { userId, mailId } = req.body;
  let inbox = userMail[userId] || [];
  userMail[userId] = inbox.filter(m => m.id !== mailId);
  res.json({ success: true });
});
type ChatMessage = { from: string; to?: string; channel: 'Global' | 'Guild' | 'System' | 'Direct'; message: string; timestamp: number };
let chatMessages: ChatMessage[] = [];

// POST /api/social/chat/send - Send a chat message (global or direct)
router.post('/social/chat/send', (req, res) => {
  const { from, to, channel, message } = req.body;
  if (!message || message.length > 500) return res.status(400).json({ error: 'Message too long or empty' });
  if (channel === 'Direct' && !to) return res.status(400).json({ error: 'Direct messages require a recipient' });
  chatMessages.push({ from, to, channel, message, timestamp: Date.now() });
  res.json({ success: true });
});

// GET /api/social/chat/history - Get recent chat messages (global or direct)
router.get('/social/chat/history', (req, res) => {
  const { userId, channel, withUser } = req.query;
  let messages;
  if (channel === 'Direct' && withUser) {
    messages = chatMessages.filter(m => m.channel === 'Direct' && ((m.from === userId && m.to === withUser) || (m.from === withUser && m.to === userId)));
  } else if (channel) {
    messages = chatMessages.filter(m => m.channel === channel);
  } else {
    messages = chatMessages.filter(m => m.channel === 'Global');
  }
  res.json({ messages: messages.slice(-100) });
});

// POST /api/social/chat/moderate - Moderate (delete) a chat message (admin only, demo)
router.post('/social/chat/moderate', (req, res) => {
  const { timestamp } = req.body;
  const idx = chatMessages.findIndex(m => m.timestamp === timestamp);
  if (idx !== -1) chatMessages.splice(idx, 1);
  res.json({ success: true });
});
type FriendRequest = { from: string; to: string; status: 'pending' | 'accepted' | 'declined' | 'blocked'; timestamp: number };
let userFriends: Record<string, { friends: string[]; blocked: string[]; requests: FriendRequest[] }> = {};

// GET /api/social/friends - Get friend list
router.get('/social/friends', (req, res) => {
  const userId = req.query.userId as string;
  let user = userFriends[userId];
  if (!user) user = userFriends[userId] = { friends: [], blocked: [], requests: [] };
  res.json({ friends: user.friends, blocked: user.blocked });
});

// GET /api/social/friends/requests - Get incoming/outgoing friend requests
router.get('/social/friends/requests', (req, res) => {
  const userId = req.query.userId as string;
  let user = userFriends[userId];
  if (!user) user = userFriends[userId] = { friends: [], blocked: [], requests: [] };
  const incoming = Object.values(userFriends).flatMap(u => u.requests.filter(r => r.to === userId && r.status === 'pending'));
  const outgoing = user.requests.filter(r => r.from === userId && r.status === 'pending');
  res.json({ incoming, outgoing });
});

// POST /api/social/friends/request - Send a friend request
router.post('/social/friends/request', (req, res) => {
  const { from, to } = req.body;
  if (from === to) return res.status(400).json({ error: 'Cannot friend yourself' });
  let user = userFriends[from];
  if (!user) user = userFriends[from] = { friends: [], blocked: [], requests: [] };
  let target = userFriends[to];
  if (!target) target = userFriends[to] = { friends: [], blocked: [], requests: [] };
  if (user.friends.includes(to)) return res.status(400).json({ error: 'Already friends' });
  if (user.blocked.includes(to) || target.blocked.includes(from)) return res.status(400).json({ error: 'Blocked' });
  if (user.requests.some(r => r.to === to && r.status === 'pending')) return res.status(400).json({ error: 'Request already sent' });
  const request: FriendRequest = { from, to, status: 'pending', timestamp: Date.now() };
  user.requests.push(request);
  res.json({ success: true, request });
});

// POST /api/social/friends/respond - Accept/decline a friend request
router.post('/social/friends/respond', (req, res) => {
  const { userId, from, action } = req.body; // action: 'accept' | 'decline'
  let user = userFriends[userId];
  if (!user) user = userFriends[userId] = { friends: [], blocked: [], requests: [] };
  let requester = userFriends[from];
  if (!requester) requester = userFriends[from] = { friends: [], blocked: [], requests: [] };
  const reqIdx = requester.requests.findIndex(r => r.to === userId && r.status === 'pending');
  if (reqIdx === -1) return res.status(404).json({ error: 'Request not found' });
  if (action === 'accept') {
    requester.requests[reqIdx].status = 'accepted';
    user.friends.push(from);
    requester.friends.push(userId);
    res.json({ success: true });
  } else {
    requester.requests[reqIdx].status = 'declined';
    res.json({ success: true });
  }
});

// POST /api/social/friends/block - Block a user
router.post('/social/friends/block', (req, res) => {
  const { userId, targetId } = req.body;
  let user = userFriends[userId];
  if (!user) user = userFriends[userId] = { friends: [], blocked: [], requests: [] };
  if (!user.blocked.includes(targetId)) user.blocked.push(targetId);
  // Remove from friends if present
  user.friends = user.friends.filter(f => f !== targetId);
  // Remove any pending requests
  user.requests = user.requests.filter(r => r.to !== targetId && r.from !== targetId);
  res.json({ success: true });
});
import { GuildRaid, SoloRaid } from '../data/raids';
let activeGuildRaids: GuildRaid[] = [];
let activeSoloRaids: SoloRaid[] = [];

// PvP ban check middleware stub (replace with real logic)
function checkPvPBan(req: any, res: any, next: any) {
  // Example: always allow
  next();
}
// --- Prestige Cosmetic System: Aesthetic Archive ---
const COSMETIC_TYPES = [
  'commanderSkin', 'shipSkin', 'profileFrame', 'title', 'emblem', 'background',
  'guildBanner', 'guildEmblem', 'guildTitle', 'abilityVFX', 'aura', 'trail', 'seasonal', 'mythic'
];
const COSMETIC_RARITIES = ['common', 'rare', 'epic', 'legendary', 'mythic'];

// In-memory user cosmetic state (replace with DB in production)
let userCosmetics: Record<string, {
  owned: string[];
  equipped: Record<string, string>;
  prestigeTokens: number;
}> = {};

// GET /api/cosmetics - Get owned/unlocked cosmetics
router.get('/cosmetics', (req, res) => {
  const userId = req.query.userId as string;
  let user = userCosmetics[userId];
  if (!user) {
    user = { owned: [], equipped: {}, prestigeTokens: 0 };
    userCosmetics[userId] = user;
  }
  const owned = PRESTIGE_COSMETICS.filter(c => user.owned.includes(c.id));
  res.json({ owned, equipped: user.equipped, prestigeTokens: user.prestigeTokens });
});

// GET /api/cosmetics/shop - Get current prestige shop (rotates weekly)
router.get('/cosmetics/shop', (_req, res) => {
  const week = Math.floor((new Date().getTime() / (7 * 24 * 60 * 60 * 1000))) % PRESTIGE_SHOP_ROTATION.length;
  const shop = PRESTIGE_SHOP_ROTATION[week];
  res.json({ shop });
});

// POST /api/cosmetics/shop/purchase - Purchase from prestige shop
router.post('/cosmetics/shop/purchase', (req, res) => {
  const { userId, cosmeticId } = req.body;
  let user = userCosmetics[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  const cosmetic = PRESTIGE_COSMETICS.find(c => c.id === cosmeticId);
  if (!cosmetic) return res.status(404).json({ error: 'Cosmetic not found' });
  // Demo: cost by rarity
  const rarityCost = { common: 10, rare: 30, epic: 80, legendary: 200, mythic: 500 };
  const cost = rarityCost[cosmetic.rarity] || 100;
  if (user.prestigeTokens < cost) return res.status(400).json({ error: 'Not enough prestige tokens' });
  if (user.owned.includes(cosmeticId)) return res.status(400).json({ error: 'Already owned' });
  user.prestigeTokens -= cost;
  user.owned.push(cosmeticId);
  res.json({ success: true, cosmetic });
});

// POST /api/cosmetics/equip - Equip/set a cosmetic
router.post('/cosmetics/equip', (req, res) => {
  const { userId, type, cosmeticId } = req.body;
  let user = userCosmetics[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.owned.includes(cosmeticId)) return res.status(400).json({ error: 'Cosmetic not owned' });
  user.equipped[type] = cosmeticId;
  res.json({ success: true, equipped: user.equipped });
});

// POST /api/cosmetics/token/grant - Grant prestige tokens (from PvP, raids, milestones, legendary unlocks)
router.post('/cosmetics/token/grant', (req, res) => {
  const { userId, amount } = req.body;
  let user = userCosmetics[userId];
  if (!user) {
    user = { owned: [], equipped: {}, prestigeTokens: 0 };
    userCosmetics[userId] = user;
  }
  user.prestigeTokens += amount;
  res.json({ success: true, prestigeTokens: user.prestigeTokens });
});
// --- Gacha/Summoning System: Signal Array ---
const SUMMON_TYPES = ['basic', 'advanced', 'legendary', 'faction', 'seasonal'];
const SUMMON_CURRENCIES = {
  basic: 'signalToken',
  advanced: 'encryptedSignalToken',
  legendary: 'legendaryCrystal',
  faction: 'factionBeacon',
  seasonal: 'seasonalKey'
};
// Updated SummonBanner type and mock data
const SUMMON_BANNERS = [
  {
    id: 'basic',
    name: 'Basic Signal',
    type: 'basic',
    featuredUnits: [
      { id: 'c1', name: 'Commander Alpha', rarity: 'rare', faction: 'Wraithbound' },
      { id: 's1', name: 'Scout Ship', rarity: 'rare', faction: 'Riftborn' }
    ],
    cost: { currency: 'signalToken', amount: 1 },
    multiCost: { currency: 'signalToken', amount: 10 },
    pity: { pullsUntilLegendaryShard: 20, pullsUntilLegendaryUnit: 100 },
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
  },
  {
    id: 'advanced',
    name: 'Encrypted Signal',
    type: 'advanced',
    featuredUnits: [
      { id: 'c2', name: 'Commander Beta', rarity: 'epic', faction: 'Obsidian Choir' },
      { id: 's2', name: 'Frigate', rarity: 'epic', faction: 'Wraithbound' }
    ],
    cost: { currency: 'encryptedSignalToken', amount: 1 },
    multiCost: { currency: 'encryptedSignalToken', amount: 10 },
    pity: { pullsUntilLegendaryShard: 30, pullsUntilLegendaryUnit: 120 },
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks from now
  },
  {
    id: 'legendary',
    name: 'Legendary Signal',
    type: 'legendary',
    featuredUnits: [
      { id: 'c3', name: 'Commander Gamma', rarity: 'legendary', faction: 'Riftborn' }
    ],
    cost: { currency: 'legendaryCrystal', amount: 1 },
    multiCost: { currency: 'legendaryCrystal', amount: 10 },
    pity: { pullsUntilLegendaryShard: 50, pullsUntilLegendaryUnit: 200 },
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 1 month from now
  },
  {
    id: 'faction',
    name: 'Faction Signal',
    type: 'faction',
    featuredUnits: [
      { id: 'c4', name: 'Commander Delta', rarity: 'epic', faction: 'Wraithbound' }
    ],
    cost: { currency: 'factionBeacon', amount: 1 },
    multiCost: { currency: 'factionBeacon', amount: 10 },
    pity: { pullsUntilLegendaryShard: 30, pullsUntilLegendaryUnit: 120 },
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
  },
  {
    id: 'seasonal',
    name: 'Seasonal Signal',
    type: 'seasonal',
    featuredUnits: [
      { id: 'c5', name: 'Commander Epsilon', rarity: 'legendary', faction: 'Obsidian Choir' }
    ],
    cost: { currency: 'seasonalKey', amount: 1 },
    multiCost: { currency: 'seasonalKey', amount: 10 },
    pity: { pullsUntilLegendaryShard: 40, pullsUntilLegendaryUnit: 160 },
    endsAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString() // 3 weeks from now
  }
];
const SUMMON_SHOPS = {
  basicShop: [
    { itemId: 'common-module', name: 'Common Module', cost: 10, type: 'module' },
    { itemId: 'common-blueprint', name: 'Common Blueprint', cost: 15, type: 'blueprint' }
  ],
  advancedShop: [
    { itemId: 'rare-module', name: 'Rare Module', cost: 30, type: 'module' },
    { itemId: 'rare-blueprint', name: 'Rare Blueprint', cost: 40, type: 'blueprint' },
    { itemId: 'commander-shard', name: 'Commander Shard', cost: 50, type: 'shard' }
  ],
  legendaryShop: [
    { itemId: 'legendary-shard', name: 'Legendary Shard', cost: 100, type: 'shard' },
    { itemId: 'legendary-module', name: 'Legendary Module', cost: 120, type: 'module' },
    { itemId: 'legendary-cosmetic', name: 'Legendary Cosmetic', cost: 200, type: 'cosmetic' }
  ],
  factionShop: [
    { itemId: 'faction-shard', name: 'Faction Shard', cost: 60, type: 'shard' },
    { itemId: 'faction-module', name: 'Faction Module', cost: 80, type: 'module' },
    { itemId: 'faction-cosmetic', name: 'Faction Cosmetic', cost: 120, type: 'cosmetic' }
  ],
  seasonalShop: [
    { itemId: 'seasonal-legendary', name: 'Seasonal Legendary', cost: 150, type: 'legendary' },
    { itemId: 'seasonal-module', name: 'Seasonal Module', cost: 100, type: 'module' },
    { itemId: 'seasonal-cosmetic', name: 'Seasonal Cosmetic', cost: 180, type: 'cosmetic' }
  ]
};

// In-memory user summon state (replace with DB in production)
type UserSummon = {
  currencies: Record<string, number>;
  pity: Record<string, number>;
  history: { bannerId: string; pulls: any[] }[];
  inventory: {
    commanders: Set<string>;
    shards: Record<string, number>;
    ships: Set<string>;
    modules: Set<string>;
  };
};
let userSummon: Record<string, UserSummon> = {};

// GET /api/summon/banners - Get current summon banners with per-user pity state
router.get('/summon/banners', (req, res) => {
  // For demo, use userId query param to return pity state (if present)
  const userId = req.query.userId as string | undefined;
  let pityState: Record<string, { pullsUntilLegendaryShard?: number; pullsUntilLegendaryUnit?: number }> = {};
  if (userId && userSummon[userId] && userSummon[userId].pity) {
    // For each banner, calculate remaining pulls for pity
    for (const banner of SUMMON_BANNERS) {
      const pity = userSummon[userId].pity[banner.id] || 0;
      pityState[banner.id] = {
        pullsUntilLegendaryShard: banner.pity.pullsUntilLegendaryShard ? Math.max(0, banner.pity.pullsUntilLegendaryShard - pity) : undefined,
        pullsUntilLegendaryUnit: banner.pity.pullsUntilLegendaryUnit ? Math.max(0, banner.pity.pullsUntilLegendaryUnit - pity) : undefined
      };
    }
  }
  res.json({ banners: SUMMON_BANNERS, pity: pityState });
});

// GET /api/summon/history - Get user summon history
router.get('/summon/history', (req, res) => {
  const userId = req.query.userId as string;
  let user = userSummon[userId];
  if (!user) user = {
    currencies: {},
    pity: {},
    history: [],
    inventory: {
      commanders: new Set(),
      shards: {},
      ships: new Set(),
      modules: new Set()
    }
  };
  res.json({ history: user.history });
});

// POST /api/summon/pull - Perform a summon (single/multi)
// POST /api/summon/pull - Perform a summon (single/multi) with SummonResponse structure
router.post('/summon/pull', (req, res) => {
  const { userId, bannerId, count } = req.body;
  let user = userSummon[userId];
  if (!user) {
    user = {
      currencies: {},
      pity: {},
      history: [],
      inventory: {
        commanders: new Set(),
        shards: {},
        ships: new Set(),
        modules: new Set()
      }
    };
    userSummon[userId] = user;
  }
  const banner = SUMMON_BANNERS.find(b => b.id === bannerId);
  if (!banner) return res.status(404).json({ error: 'Banner not found' });
  const currency = banner.cost.currency;
  const pullsCount = count || 1;
  if ((user.currencies[currency] || 0) < (pullsCount * banner.cost.amount)) {
    return res.status(400).json({ error: 'Not enough currency' });
  }
  user.currencies[currency] -= pullsCount * banner.cost.amount;

  let results: SummonResultItem[] = [];
  for (let i = 0; i < pullsCount; i++) {
    user.pity[bannerId] = (user.pity[bannerId] || 0) + 1;
    let pityShard = banner.pity.pullsUntilLegendaryShard;
    let pityUnit = banner.pity.pullsUntilLegendaryUnit;
    let pityCount = user.pity[bannerId];
    let resultItem: SummonResultItem;
    if (pityShard && pityCount % pityShard === 0) {
      resultItem = { type: 'commanderShard', commanderId: 'legendary', amount: 10, isNew: true };
    } else if (pityUnit && pityCount % pityUnit === 0) {
      resultItem = { type: 'commander', commanderId: 'legendary', isNew: !user.inventory.commanders.has('legendary') };
      user.inventory.commanders.add('legendary');
    } else {
      const featured = banner.featuredUnits[Math.floor(Math.random() * banner.featuredUnits.length)];
      if (featured.rarity === 'legendary') {
        resultItem = { type: 'commander', commanderId: featured.id, isNew: !user.inventory.commanders.has(featured.id) };
        user.inventory.commanders.add(featured.id);
      } else if (featured.rarity === 'epic') {
        resultItem = { type: 'commanderShard', commanderId: featured.id, amount: 5, isNew: !(featured.id in user.inventory.shards) };
        user.inventory.shards[featured.id] = (user.inventory.shards[featured.id] || 0) + 5;
      } else {
        resultItem = { type: 'shipBlueprint', shipId: featured.id, amount: 1, isNew: !user.inventory.ships.has(featured.id) };
        user.inventory.ships.add(featured.id);
      }
    }
    results.push(resultItem);
  }
  // Record history
  user.history.push({ bannerId, pulls: results });

  // Prepare pity state for response
  const pityState = {
    pullsUntilLegendaryShard: banner.pity.pullsUntilLegendaryShard ? Math.max(0, banner.pity.pullsUntilLegendaryShard - (user.pity[bannerId] % banner.pity.pullsUntilLegendaryShard)) : undefined,
    pullsUntilLegendaryUnit: banner.pity.pullsUntilLegendaryUnit ? Math.max(0, banner.pity.pullsUntilLegendaryUnit - (user.pity[bannerId] % banner.pity.pullsUntilLegendaryUnit)) : undefined
  };

  // Return SummonResponse
  res.json({
    bannerId,
    count: pullsCount,
    results,
    currencies: user.currencies,
    pity: pityState
  });
});

// GET /api/summon/shop/:bannerId - Get summon shop for a banner
router.get('/summon/shop/:bannerId', (req, res) => {
  const { bannerId } = req.params;
  const banner = SUMMON_BANNERS.find(b => b.id === bannerId);
  if (!banner) return res.status(404).json({ error: 'Banner not found' });
  // For now, just return the shop for the banner type
  const shop = SUMMON_SHOPS[bannerId + 'Shop'] || [];
  res.json({ shop });
});

// POST /api/summon/shop/purchase - Purchase from summon shop
router.post('/summon/shop/purchase', (req, res) => {
  const { userId, bannerId, itemId } = req.body;
  let user = userSummon[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  const banner = SUMMON_BANNERS.find(b => b.id === bannerId);
  if (!banner) return res.status(404).json({ error: 'Banner not found' });
  const shop = SUMMON_SHOPS[bannerId + 'Shop'] || [];
  const item = shop.find(i => i.itemId === itemId);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  // For demo, use summon currency for purchase
  const currency = SUMMON_CURRENCIES[banner.type];
  if ((user.currencies[currency] || 0) < item.cost) return res.status(400).json({ error: 'Not enough currency' });
  user.currencies[currency] -= item.cost;
  res.json({ success: true, item });
});

// POST /api/summon/currency/grant - Grant summon currency (admin/demo)
router.post('/summon/currency/grant', (req, res) => {
  const { userId, type, amount } = req.body;
  let user = userSummon[userId];
  if (!user) {
    user = {
      currencies: {},
      pity: {},
      history: [],
      inventory: {
        commanders: new Set(),
        shards: {},
        ships: new Set(),
        modules: new Set()
      }
    };
    userSummon[userId] = user;
  }
  user.currencies[type] = (user.currencies[type] || 0) + amount;
  res.json({ success: true, currencies: user.currencies });
});
// ...existing code...

const VIP_SHOP_ROTATION = [
  // Rotates weekly
  [
    { itemId: 'vip-commander-shard', name: 'VIP Commander Shard', cost: 100, type: 'shard' },
    { itemId: 'vip-blueprint', name: 'VIP Ship Blueprint', cost: 200, type: 'blueprint' },
    { itemId: 'vip-module', name: 'VIP Module', cost: 150, type: 'module' },
    { itemId: 'vip-cosmetic', name: 'VIP Cosmetic', cost: 300, type: 'cosmetic' }
  ],
  [
    { itemId: 'vip-legendary-shard', name: 'Legendary Shard', cost: 300, type: 'shard' },
    { itemId: 'vip-seasonal-currency', name: 'Seasonal Currency', cost: 100, type: 'currency' },
    { itemId: 'vip-frame', name: 'VIP Profile Frame', cost: 400, type: 'cosmetic' }
  ]
];

const VIP_MISSIONS = {
  daily: [
    { id: 'vip-win3', desc: 'Win 3 battles', reward: { type: 'vipXp', amount: 20 } },
    { id: 'vip-spend200', desc: 'Spend 200 energy', reward: { type: 'premiumCurrency', amount: 10 } },
    { id: 'vip-raid1', desc: 'Complete 1 raid', reward: { type: 'raidToken', amount: 5 } }
  ],
  weekly: [
    { id: 'vip-missions10', desc: 'Complete 10 missions', reward: { type: 'legendaryShard', amount: 2 } },
    { id: 'vip-pvp10', desc: 'Win 10 PvP battles', reward: { type: 'premiumCurrency', amount: 50 } }
  ]
};

const VIP_COSMETICS = [
  { level: 1, frame: 'Bronze Frame', title: 'VIP 1', emote: 'Salute', aura: 'None', trail: 'None' },
  { level: 5, frame: 'Silver Frame', title: 'VIP 5', emote: 'Wave', aura: 'Silver Aura', trail: 'Silver Trail' },
  { level: 10, frame: 'Gold Frame', title: 'VIP 10', emote: 'Cheer', aura: 'Gold Aura', trail: 'Gold Trail' },
  { level: 15, frame: 'Mythic Frame', title: 'VIP 15', emote: 'Triumph', aura: 'Mythic Aura', trail: 'Mythic Trail' }
];

// In-memory VIP state (replace with DB in production)
let userVIP: Record<string, {
  xp: number;
  level: number;
  claimed: number[];
  cosmetics: string[];
  missions: { daily: string[]; weekly: string[] };
}> = {};

// GET /api/vip - Get VIP status, progress, and benefits
router.get('/vip', (req, res) => {
  const userId = req.query.userId as string;
  let user = userVIP[userId];
  if (!user) {
    user = { xp: 0, level: 1, claimed: [], cosmetics: [], missions: { daily: [], weekly: [] } };
    userVIP[userId] = user;
  }
  const vipLevel = VIP_LEVELS.find(lvl => lvl.level === user.level);
  res.json({ vip: { xp: user.xp, level: user.level, claimed: user.claimed, cosmetics: user.cosmetics, missions: user.missions }, benefits: vipLevel });
});

// POST /api/vip/xp - Grant VIP XP (from purchases, pass, bundles, events)
router.post('/vip/xp', (req, res) => {
  const { userId, amount } = req.body;
  let user = userVIP[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.xp += amount;
  // Calculate new level based on VIP_LEVELS xpRequired
  let newLevel = 1;
  for (let i = 0; i < VIP_LEVELS.length; i++) {
    if (user.xp >= (VIP_LEVELS[i].xpRequired ?? 0)) newLevel = VIP_LEVELS[i].level;
  }
  user.level = Math.min(newLevel, VIP_LEVELS.length);
  res.json({ success: true, xp: user.xp, level: user.level });
});

// POST /api/vip/claim - Claim VIP level rewards (perks, cosmetics)
router.post('/vip/claim', (req, res) => {
  const { userId, level } = req.body;
  let user = userVIP[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (level > user.level) return res.status(400).json({ error: 'Level not unlocked yet' });
  if (user.claimed.includes(level)) return res.status(400).json({ error: 'Already claimed' });
  user.claimed.push(level);
  // Grant cosmetics for this level
  const cosmetics = VIP_COSMETICS.filter(c => c.level === level).map(c => c.frame + ',' + c.title + ',' + c.emote + ',' + c.aura + ',' + c.trail);
  user.cosmetics.push(...cosmetics);
  res.json({ success: true, cosmetics });
});

// GET /api/vip/missions - Get VIP missions (daily/weekly)
router.get('/vip/missions', (req, res) => {
  res.json(VIP_MISSIONS);
});

// POST /api/vip/mission/complete - Complete a VIP mission and grant reward
router.post('/vip/mission/complete', (req, res) => {
  const { userId, type, missionId } = req.body;
  let user = userVIP[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.missions[type]?.includes(missionId)) return res.status(400).json({ error: 'Already completed' });
  const mission = VIP_MISSIONS[type]?.find((m: any) => m.id === missionId);
  if (!mission) return res.status(404).json({ error: 'Mission not found' });
  user.missions[type].push(missionId);
  // Grant reward (demo: just return reward)
  res.json({ success: true, reward: mission.reward });
});

// GET /api/vip/shop - Get VIP shop (rotates weekly)
router.get('/vip/shop', (_req, res) => {
  // Demo: rotate by week number
  const week = Math.floor((new Date().getTime() / (7 * 24 * 60 * 60 * 1000))) % VIP_SHOP_ROTATION.length;
  const shop = VIP_SHOP_ROTATION[week];
  res.json({ shop });
});
// --- Imports and Router Initialization ---
import { Router } from 'express';
import { LEGENDARY_COMMANDERS } from '../data/legendaryCommanders';
import { SEASON_1, SEASON_1_MISSIONS, SEASON_1_BOSSES, SEASON_1_SHOP } from '../data/season1';
import { FACTION_MASTERY_PATHS_FULL } from '../data/factionMasteryPathsFull';
import { LEGENDARY_UNLOCK_CHAINS_FULL } from '../data/legendaryUnlockChainsFull';
import { COMMANDER_SYNERGY_MATRIX } from '../data/commanderSynergyMatrix';
import { COMMANDER_TIER_LIST_FULL } from '../data/commanderTierListFull';
import { Guild, GUILD_LEVEL_REWARDS, GUILD_MISSIONS } from '../data/guilds';
import { GUILD_RAIDS, SOLO_RAIDS } from '../data/raids';
import { PvPPlayer, PvPFleet, PvPBattle, PvPMode, PvPShopItem, PVP_SHOPS, PVP_MODES, PVP_DIVISIONS } from '../data/pvp';

// --- Battle Pass (Seasonal Operations Pass) ---
// Data model for Season 1: Awakening of the Choir
const BATTLE_PASS_SEASON = {
  seasonId: 'season1',
  name: 'Awakening of the Choir',
  start: 0, // Set to actual start timestamp
  end: 0,   // Set to actual end timestamp
  lengthWeeks: 8,
  tracks: ['free', 'premium', 'premiumPlus'],
  tiers: 50,
  xpCurve: [
    ...Array(10).fill(500),   // Tiers 1-10: fast
    ...Array(20).fill(1000),  // Tiers 11-30: moderate
    ...Array(20).fill(2000),  // Tiers 31-50: slow
  ],
  instantUnlocks: {
    premiumPlus: [
      { type: 'cosmetic', cosmeticType: 'commanderSkin', name: 'Vor’Keth “Starless Ascendant”' },
      { type: 'cosmetic', cosmeticType: 'shipSkin', name: 'Choir Cruiser Obsidian Hull' },
      { type: 'legendaryShard', amount: 10 },
      { type: 'cosmetic', cosmeticType: 'emblem', name: 'Season 1 Premium Emblem' }
    ]
  },
  rewards: Array.from({ length: 50 }, (_, i) => ({
    tier: i + 1,
    free: [
      { type: 'currency', currency: 'credits', amount: 1000 + i * 100 },
      { type: 'item', item: 'alloy', amount: 5 },
      { type: 'item', item: 'skipTicket', amount: 1 },
      { type: 'currency', currency: 'seasonal', amount: 10 },
      { type: 'item', item: 'raidKey', amount: 1 },
      { type: 'item', item: 'pvpToken', amount: 2 }
    ][i % 6], // Rotate for demo
    premium: [
      { type: 'legendaryShard', amount: 2 },
      { type: 'item', item: 'shipBlueprint', amount: 1 },
      { type: 'item', item: 'abilityModule', amount: 1 },
      { type: 'item', item: 'rareAlloy', amount: 3 },
      { type: 'cosmetic', cosmeticType: 'seasonal', name: 'Profile Frame: The First Hymn' },
      { type: 'currency', currency: 'premiumEnergy', amount: 5 }
    ][i % 6],
    premiumPlus: i === 0 ? [
      { type: 'cosmetic', cosmeticType: 'commanderSkin', name: 'Vor’Keth “Starless Ascendant”' },
      { type: 'cosmetic', cosmeticType: 'shipSkin', name: 'Choir Cruiser Obsidian Hull' },
      { type: 'legendaryShard', amount: 10 },
      { type: 'cosmetic', cosmeticType: 'emblem', name: 'Season 1 Premium Emblem' }
    ] : []
  })),
  cosmetics: [
    { type: 'commanderSkin', name: 'Vor’Keth “Starless Ascendant”', exclusive: true },
    { type: 'shipSkin', name: 'Choir Cruiser Obsidian Hull', exclusive: true },
    { type: 'profileFrame', name: 'The First Hymn', exclusive: true },
    { type: 'title', name: 'Resonant', exclusive: true }
  ],
  missions: {
    daily: [
      { id: 'win3battles', desc: 'Win 3 battles', xp: 100 },
      { id: 'sector2', desc: 'Complete 2 sector missions', xp: 100 },
      { id: 'spend200energy', desc: 'Spend 200 energy', xp: 100 },
      { id: 'useAbility', desc: 'Use 1 commander ability X times', xp: 100 },
      { id: 'defeat10', desc: 'Defeat 10 enemies', xp: 100 }
    ],
    weekly: [
      { id: 'missions10', desc: 'Complete 10 missions', xp: 500 },
      { id: 'pvp5', desc: 'Win 5 PvP battles', xp: 500 },
      { id: 'boss2', desc: 'Defeat 2 bosses', xp: 500 },
      { id: 'fleet5000', desc: 'Earn 5,000 fleet power', xp: 500 },
      { id: 'faction3', desc: 'Complete 3 faction missions', xp: 500 }
    ],
    seasonal: [
      { id: 'seasonal20', desc: 'Complete 20 seasonal missions', xp: 2000 },
      { id: 'seasonalBoss', desc: 'Defeat the seasonal boss', xp: 2000 },
      { id: 'resonance10', desc: 'Earn 10 Resonance (Choir season)', xp: 2000 },
      { id: 'factionArena10', desc: 'Win 10 Faction Arena battles', xp: 2000 },
      { id: 'raids5', desc: 'Complete 5 raids', xp: 2000 }
    ]
  },
  story: [
    'Awakening', 'First Hymn', 'Starless Pulse', 'Choir Prime Echo',
    'Harmonic Shift', 'Legendary Hunt', 'Black Wave', 'Final Hymn'
  ]
};

// In-memory user pass progress (replace with DB in production)
let userBattlePass: Record<string, {
  xp: number;
  tier: number;
  claimed: { [track: string]: number[] };
  unlocked: string[];
  premium: boolean;
  premiumPlus: boolean;
  missions: { daily: string[]; weekly: string[]; seasonal: string[] };
}> = {};

// GET /api/battlepass - Get current pass structure and user progress
router.get('/battlepass', (req, res) => {
  const userId = req.query.userId as string;
  let user = userBattlePass[userId];
  if (!user) {
    user = {
      xp: 0,
      tier: 1,
      claimed: { free: [], premium: [], premiumPlus: [] },
      unlocked: [],
      premium: false,
      premiumPlus: false,
      missions: { daily: [], weekly: [], seasonal: [] }
    };
    userBattlePass[userId] = user;
  }
  res.json({ pass: BATTLE_PASS_SEASON, user });
});

// POST /api/battlepass/claim - Claim a tier reward
router.post('/battlepass/claim', (req, res) => {
  const { userId, track, tier } = req.body;
  let user = userBattlePass[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (tier > user.tier) return res.status(400).json({ error: 'Tier not unlocked yet' });
  if (user.claimed[track]?.includes(tier)) return res.status(400).json({ error: 'Already claimed' });
  if (track === 'premium' && !user.premium) return res.status(403).json({ error: 'Premium required' });
  if (track === 'premiumPlus' && !user.premiumPlus) return res.status(403).json({ error: 'Premium+ required' });
  user.claimed[track].push(tier);
  // Grant rewards (demo: just return reward)
  const reward = BATTLE_PASS_SEASON.rewards[tier - 1]?.[track];
  res.json({ success: true, reward });
});

// POST /api/battlepass/xp - Grant XP (from missions, PvP, raids, etc.)
router.post('/battlepass/xp', (req, res) => {
  const { userId, amount } = req.body;
  let user = userBattlePass[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.xp += amount;
  // Calculate new tier
  let total = 0;
  let newTier = 1;
  for (let i = 0; i < BATTLE_PASS_SEASON.xpCurve.length; i++) {
    total += BATTLE_PASS_SEASON.xpCurve[i];
    if (user.xp >= total) newTier = i + 2;
  }
  user.tier = Math.min(newTier, BATTLE_PASS_SEASON.tiers);
  res.json({ success: true, xp: user.xp, tier: user.tier });
});

// GET /api/battlepass/missions - Get missions (daily, weekly, seasonal)
router.get('/battlepass/missions', (req, res) => {
  res.json(BATTLE_PASS_SEASON.missions);
});

// POST /api/battlepass/mission/complete - Complete a mission and grant XP
router.post('/battlepass/mission/complete', (req, res) => {
  const { userId, type, missionId } = req.body;
  let user = userBattlePass[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.missions[type]?.includes(missionId)) return res.status(400).json({ error: 'Already completed' });
  const mission = BATTLE_PASS_SEASON.missions[type]?.find((m: any) => m.id === missionId);
  if (!mission) return res.status(404).json({ error: 'Mission not found' });
  user.missions[type].push(missionId);
  user.xp += mission.xp;
  // Update tier
  let total = 0;
  let newTier = 1;
  for (let i = 0; i < BATTLE_PASS_SEASON.xpCurve.length; i++) {
    total += BATTLE_PASS_SEASON.xpCurve[i];
    if (user.xp >= total) newTier = i + 2;
  }
  user.tier = Math.min(newTier, BATTLE_PASS_SEASON.tiers);
  res.json({ success: true, xp: user.xp, tier: user.tier });
});

// POST /api/battlepass/purchase - Purchase/upgrade pass (Premium, Premium+)
router.post('/battlepass/purchase', (req, res) => {
  const { userId, type } = req.body;
  let user = userBattlePass[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (type === 'premium') user.premium = true;
  if (type === 'premiumPlus') { user.premium = true; user.premiumPlus = true; user.unlocked.push(...BATTLE_PASS_SEASON.instantUnlocks.premiumPlus.map(i => i.type + ':' + (i.name || i.amount))); }
  res.json({ success: true, premium: user.premium, premiumPlus: user.premiumPlus, unlocked: user.unlocked });
});

// POST /api/battlepass/skip - Skip tiers (buy tier skips)
router.post('/battlepass/skip', (req, res) => {
  const { userId, count } = req.body;
  let user = userBattlePass[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.tier = Math.min(user.tier + count, BATTLE_PASS_SEASON.tiers);
  res.json({ success: true, tier: user.tier });
});

// POST /api/battlepass/claimall - Claim all unlocked rewards
router.post('/battlepass/claimall', (req, res) => {
  const { userId } = req.body;
  let user = userBattlePass[userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  for (let track of ['free', 'premium', 'premiumPlus']) {
    for (let t = 1; t <= user.tier; t++) {
      if (!user.claimed[track].includes(t)) user.claimed[track].push(t);
    }
  }
  res.json({ success: true, claimed: user.claimed });
});
// --- LiveOps Raid Integration ---

// GET /api/liveops/raids/featured-guild - Get current featured guild raid (rotates weekly)
router.get('/liveops/raids/featured-guild', (_req, res) => {
  // Demo: rotate by week number
  const week = Math.floor((new Date().getTime() / (7 * 24 * 60 * 60 * 1000))) % GUILD_RAIDS.length;
  const featured = GUILD_RAIDS[week % GUILD_RAIDS.length];
  res.json({ featured });
});

// GET /api/liveops/raids/featured-solo - Get current featured solo raid (rotates daily)
router.get('/liveops/raids/featured-solo', (_req, res) => {
  const day = new Date().getDay();
  const featured = SOLO_RAIDS[day % SOLO_RAIDS.length];
  res.json({ featured });
});

// GET /api/liveops/raids/spotlight - Get current raid spotlight (monthly, demo)
router.get('/liveops/raids/spotlight', (_req, res) => {
  const month = new Date().getMonth();
  const spotlight = GUILD_RAIDS[month % GUILD_RAIDS.length];
  res.json({ spotlight });
});

// GET /api/liveops/raids/seasonal - Get current seasonal mega-raid (demo: first raid, could be special)
router.get('/liveops/raids/seasonal', (_req, res) => {
  const seasonal = GUILD_RAIDS[0];
  res.json({ seasonal });
});
// --- Raid Shops & Leaderboards ---

// Demo static raid shop items
const RAID_SHOP_ITEMS = [
  { itemId: 'raid-module-1', name: 'Raid Module Alpha', cost: 200, type: 'module' },
  { itemId: 'legendary-shard', name: 'Legendary Commander Shard', cost: 500, type: 'shard' },
  { itemId: 'cosmetic-banner', name: 'Raid Banner', cost: 100, type: 'cosmetic' }
];

// GET /api/raids/guild/:raidId/shop - Get guild raid shop
router.get('/raids/guild/:raidId/shop', (req, res) => {
  // In a real system, shop could rotate or be tied to raid type
  res.json({ shop: RAID_SHOP_ITEMS });
});

// GET /api/raids/solo/:raidId/shop - Get solo raid shop
router.get('/raids/solo/:raidId/shop', (req, res) => {
  res.json({ shop: RAID_SHOP_ITEMS });
});

// GET /api/raids/guild/:raidId/leaderboard - Get guild raid leaderboard
router.get('/raids/guild/:raidId/leaderboard', (req, res) => {
  const raid = activeGuildRaids.find(r => r.raidId === req.params.raidId);
  if (!raid) return res.status(404).json({ error: 'Raid not found' });
  const leaderboard = raid.leaderboard.sort((a, b) => b.damage - a.damage);
  res.json({ leaderboard });
});

// GET /api/raids/solo/:raidId/leaderboard - Get solo raid leaderboard (demo: top scores for this template)
router.get('/raids/solo/:raidId/leaderboard', (req, res) => {
  const raid = activeSoloRaids.find(r => r.raidId === req.params.raidId);
  if (!raid) return res.status(404).json({ error: 'Raid not found' });
  // Demo: show top scores for this raid template
  const templateId = raid.raidId.split('-')[0];
  const scores = activeSoloRaids.filter(r => r.raidId.startsWith(templateId)).map(r => ({ userId: r.userId, score: r.score })).sort((a, b) => b.score - a.score).slice(0, 10);
  res.json({ leaderboard: scores });
});
// --- Solo Raid Endpoints ---

// GET /api/raids/solo - List available solo raid templates
router.get('/raids/solo', (_req, res) => {
  res.json(SOLO_RAIDS);
});

// POST /api/raids/solo/start - Start a new solo raid for a user
router.post('/raids/solo/start', (req, res) => {
  const { userId, raidTemplateId, difficulty } = req.body;
  // Only one active solo raid per user per mode
  if (activeSoloRaids.some(r => r.userId === userId && !r.completed)) return res.status(400).json({ error: 'Solo raid already active' });
  const template = SOLO_RAIDS.find(r => r.raidId === raidTemplateId && r.difficulty === difficulty);
  if (!template) return res.status(400).json({ error: 'Invalid solo raid template or difficulty' });
  const raid: SoloRaid = {
    ...JSON.parse(JSON.stringify(template)),
    raidId: `${template.raidId}-${userId}-${Date.now()}`,
    userId,
    startedAt: Date.now(),
    completed: false,
    progress: [],
    score: 0
  };
  activeSoloRaids.push(raid);
  res.json({ success: true, raid });
});

// POST /api/raids/solo/:raidId/attack - Progress solo raid (attack next wave)
router.post('/raids/solo/:raidId/attack', (req, res) => {
  const { userId, damage, time } = req.body;
  const raid = activeSoloRaids.find(r => r.raidId === req.params.raidId && r.userId === userId);
  if (!raid) return res.status(404).json({ error: 'Solo raid not found' });
  if (raid.completed) return res.status(400).json({ error: 'Raid already completed' });
  // Progress to next wave
  const wave = raid.progress.length + 1;
  raid.progress.push({ wave, damage, time });
  // End raid if all waves cleared or if user lost (simulate: if damage < threshold, fail)
  if (wave >= raid.waves || damage < 10) {
    raid.completed = true;
    raid.endedAt = Date.now();
    // Score: sum of damage, bonus for waves cleared, penalty for time
    raid.score = raid.progress.reduce((sum, p) => sum + p.damage, 0) + wave * 100 - raid.progress.reduce((sum, p) => sum + p.time, 0) / 10;
  }
  res.json({ success: true, raid });
});

// GET /api/raids/solo/:raidId/progress - Get solo raid progress
router.get('/raids/solo/:raidId/progress', (req, res) => {
  const raid = activeSoloRaids.find(r => r.raidId === req.params.raidId);
  if (!raid) return res.status(404).json({ error: 'Solo raid not found' });
  res.json({ progress: raid.progress, completed: raid.completed, score: raid.score });
});

// POST /api/raids/solo/:raidId/claim - Claim solo raid rewards (demo: based on score)
router.post('/raids/solo/:raidId/claim', (req, res) => {
  const { userId } = req.body;
  const raid = activeSoloRaids.find(r => r.raidId === req.params.raidId && r.userId === userId);
  if (!raid) return res.status(404).json({ error: 'Solo raid not found' });
  if (!raid.completed) return res.status(400).json({ error: 'Raid not completed yet' });
  // Demo rewards: score tiers
  let reward = 50;
  if (raid.score > 2000) reward += 100;
  if (raid.score > 4000) reward += 200;
  res.json({ success: true, reward, score: raid.score });
});
// --- Guild Raid Endpoints ---

// GET /api/raids/guild - List all active guild raids
router.get('/raids/guild', (_req, res) => {
  res.json(activeGuildRaids);
});

// POST /api/raids/guild/start - Start a new guild raid (admin/guild leader)
router.post('/raids/guild/start', (req, res) => {
  const { guildId, raidTemplateId, difficulty } = req.body;
  // Find template
  const template = GUILD_RAIDS.find(r => r.raidId === raidTemplateId && r.difficulty === difficulty);
  if (!template) return res.status(400).json({ error: 'Invalid raid template or difficulty' });
  // Only one active raid per guild
  if (activeGuildRaids.some(r => r.guildId === guildId && !r.completed)) return res.status(400).json({ error: 'Raid already active for this guild' });
  // Clone template for new raid instance
  const raid: GuildRaid = {
    ...JSON.parse(JSON.stringify(template)),
    raidId: `${template.raidId}-${Date.now()}`,
    guildId,
    startedAt: Date.now(),
    resetAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
    progress: [],
    leaderboard: [],
    completed: false,
    currentPhase: 0,
    remainingHp: template.totalHp
  };
  activeGuildRaids.push(raid);
  res.json({ success: true, raid });
});

// POST /api/raids/guild/:raidId/attack - Attack current phase (deal damage)
router.post('/raids/guild/:raidId/attack', (req, res) => {
  const { userId, username, damage } = req.body;
  const raid = activeGuildRaids.find(r => r.raidId === req.params.raidId);
  if (!raid) return res.status(404).json({ error: 'Raid not found' });
  if (raid.completed) return res.status(400).json({ error: 'Raid already completed' });
  // Check attempts
  let member = raid.progress.find(p => p.userId === userId);
  if (!member) {
    member = { userId, damage: 0, attempts: 0, lastAttack: 0 };
    raid.progress.push(member);
  }
  if (member.attempts >= raid.attemptsPerMember) return res.status(400).json({ error: 'No attempts left' });
  // Apply damage
  member.damage += damage;
  member.attempts += 1;
  member.lastAttack = Date.now();
  raid.remainingHp -= damage;
  // Update leaderboard
  const lb = raid.leaderboard.find(l => l.userId === userId);
  if (lb) lb.damage += damage;
  else raid.leaderboard.push({ userId, username, damage });
  // Phase/boss transitions
  while (raid.currentPhase < raid.phases.length && raid.remainingHp <= 0) {
    raid.currentPhase += 1;
    if (raid.currentPhase < raid.phases.length) {
      raid.remainingHp += raid.phases[raid.currentPhase].hp;
    } else {
      raid.completed = true;
      raid.endedAt = Date.now();
      raid.remainingHp = 0;
    }
  }
  res.json({ success: true, raid });
});

// GET /api/raids/guild/:raidId/progress - Get raid progress and leaderboard
router.get('/raids/guild/:raidId/progress', (req, res) => {
  const raid = activeGuildRaids.find(r => r.raidId === req.params.raidId);
  if (!raid) return res.status(404).json({ error: 'Raid not found' });
  res.json({ progress: raid.progress, leaderboard: raid.leaderboard, currentPhase: raid.currentPhase, remainingHp: raid.remainingHp, completed: raid.completed });
});

// POST /api/raids/guild/:raidId/claim - Claim raid rewards (demo: top 3 get bonus)
router.post('/raids/guild/:raidId/claim', (req, res) => {
  const { userId } = req.body;
  const raid = activeGuildRaids.find(r => r.raidId === req.params.raidId);
  if (!raid) return res.status(404).json({ error: 'Raid not found' });
  if (!raid.completed) return res.status(400).json({ error: 'Raid not completed yet' });
  // Demo rewards: all get tokens, top 3 get bonus
  const baseReward = 100;
  const leaderboard = raid.leaderboard.sort((a, b) => b.damage - a.damage);
  let reward = baseReward;
  const rank = leaderboard.findIndex(l => l.userId === userId);
  if (rank === 0) reward += 200;
  else if (rank === 1) reward += 100;
  else if (rank === 2) reward += 50;
  res.json({ success: true, reward, rank: rank + 1 });
});

// --- Guilds/Alliances API ---
// In-memory guilds store (replace with DB in production)
let guilds: Guild[] = [];

// GET /api/guilds - List all guilds
router.get('/guilds', (_req, res) => {
  res.json(guilds);
});

// POST /api/guilds - Create a new guild
router.post('/guilds', (req, res) => {
  const { name, emblem, description, leaderId, leaderName } = req.body;
  if (!name || !leaderId || !leaderName) return res.status(400).json({ error: 'Missing required fields' });
  const guild: Guild = {
    guildId: Date.now().toString(),
    name,
    emblem: emblem || '',
    description: description || '',
    level: 1,
    xp: 0,
    memberCap: 30,
    members: [{ userId: leaderId, username: leaderName, role: 'Leader', fleetPower: 0, commanderCount: 0, joinDate: Date.now(), contribution: 0, isActive: true }],
    roles: { Leader: [leaderId], Officer: [], Veteran: [], Member: [], Recruit: [] },
    banner: '',
    motto: '',
    achievements: [],
    power: 0,
    tokens: 0,
    raidTokens: 0,
    warTokens: 0,
    shop: [],
    activityFeed: [],
    chat: [],
    recruitment: { minFleetPower: 0, minCommanderCount: 0, joinType: 'Open', applications: [] },
    settings: { allowDonations: true, allowChat: true, allowRecruitment: true, officerLimit: 5, veteranLimit: 10, memberCap: 30 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  guilds.push(guild);
  res.json({ success: true, guild });
});

// GET /api/guilds/:guildId - Get guild details
router.get('/guilds/:guildId', (req, res) => {
  const guild = guilds.find(g => g.guildId === req.params.guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });
  res.json(guild);
});

// POST /api/guilds/:guildId/join - Apply to join a guild
router.post('/guilds/:guildId/join', (req, res) => {
  const { userId, username, fleetPower, commanderCount, message } = req.body;
  const guild = guilds.find(g => g.guildId === req.params.guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });
  guild.recruitment.applications.push({ userId, username, fleetPower, commanderCount, message, appliedAt: Date.now(), status: 'Pending' });
  guild.updatedAt = Date.now();
  res.json({ success: true });
});

// POST /api/guilds/:guildId/members/:userId/role - Change member role (admin tool)
router.post('/guilds/:guildId/members/:userId/role', (req, res) => {
  const { role } = req.body;
  const guild = guilds.find(g => g.guildId === req.params.guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });
  const member = guild.members.find(m => m.userId === req.params.userId);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  member.role = role;
  guild.updatedAt = Date.now();
  res.json({ success: true });
});

// POST /api/guilds/:guildId/chat - Post a chat message
router.post('/guilds/:guildId/chat', (req, res) => {
  const { userId, username, message, channel } = req.body;
  const guild = guilds.find(g => g.guildId === req.params.guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });
  guild.chat.push({ userId, username, message, channel, timestamp: Date.now() });
  guild.updatedAt = Date.now();
  res.json({ success: true });
});

// GET /api/guilds/:guildId/shop - Get guild shop
router.get('/guilds/:guildId/shop', (req, res) => {
  const guild = guilds.find(g => g.guildId === req.params.guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });
  res.json(guild.shop);
});

// GET /api/guilds/level-rewards - Get guild level rewards
// (moved below router declaration)

// --- Shop Endpoints (moved here for correct router order) ---
router.get('/event/:eventId/rewards', (req, res) => {
  const event = SEASON1_EVENTS.find(e => e.id === req.params.eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json({ event: event.name, rewards: event.rewards, leaderboard: event.leaderboard, milestones: event.milestones });
});
router.get('/events/season1', (_req, res) => {
  res.json(SEASON1_EVENTS.map(e => ({ id: e.id, name: e.name })));
});
router.get('/shop/featured', (_req, res) => {
  const week = getSeason1Week();
  res.json({ week: week + 1, items: FEATURED_SHOP_ROTATION[week] });
});
router.get('/shop/seasonal', (_req, res) => {
  res.json({ static: SEASONAL_SHOP_STATIC, weekly: SEASONAL_SHOP_WEEKLY });
});
router.get('/shop/prestige', (_req, res) => {
  const rotation = getPrestigeRotation();
  res.json({ rotation: rotation === 0 ? 'A' : 'B', items: PRESTIGE_SHOP_ROTATION[rotation] });
});
router.get('/shop/arena', (_req, res) => {
  res.json({ static: ARENA_SHOP_STATIC, weekly: ARENA_SHOP_WEEKLY });
});
router.get('/shop/raid', (_req, res) => {
  res.json({ static: RAID_SHOP_STATIC, choirRotation: RAID_SHOP_CHOIR_ROTATION });
});
router.get('/shop/guild', (_req, res) => {
  res.json({ static: GUILD_SHOP_STATIC });
});
router.get('/shop/faction', (_req, res) => {
  const week = getFactionShopWeek();
  res.json({ week: week + 1, items: FACTION_SHOP_ROTATION[week] });
});
// Temporary: define PRESTIGE_COSMETICS to resolve reference errors (replace with real data)
const PRESTIGE_COSMETICS: any[] = [];
router.get('/liveops/admin/events', (_req, res) => {
  res.status(501).json({ error: 'Legacy admin events endpoint removed' });
});
// POST /api/liveops/admin/events (create or update)
router.post('/liveops/admin/events', (req, res) => {
  res.status(501).json({ error: 'Legacy admin events endpoint removed' });
});

// DELETE /api/liveops/admin/events/:eventId
router.delete('/liveops/admin/events/:eventId', (req, res) => {
  res.status(501).json({ error: 'Legacy admin events endpoint removed' });
});

// GET /api/liveops/admin/shop
router.get('/liveops/admin/shop', (_req, res) => {
  res.status(501).json({ error: 'Legacy admin shop endpoint removed' });
});

// POST /api/liveops/admin/shop (create or update shop item)
router.post('/liveops/admin/shop', (req, res) => {
  res.status(501).json({ error: 'Legacy admin shop endpoint removed' });
});

// DELETE /api/liveops/admin/shop/:itemId
router.delete('/liveops/admin/shop/:itemId', (req, res) => {
  res.status(501).json({ error: 'Legacy admin shop endpoint removed' });
});
// GET /api/liveops/season/metadata
router.get('/liveops/season/metadata', (_req, res) => {
  res.json(SEASON_1);
});

// GET /api/liveops/season/missions
router.get('/liveops/season/missions', (_req, res) => {
  res.json(SEASON_1_MISSIONS);
});

// GET /api/liveops/season/bosses
router.get('/liveops/season/bosses', (_req, res) => {
  res.json(SEASON_1_BOSSES);
});

// GET /api/liveops/season/shop
router.get('/liveops/season/shop', (_req, res) => {
  res.json(SEASON_1_SHOP);
});

// --- LiveOps Data Model ---
export const LIVEOPS_CONFIG = {
  weekly: [
    {
      key: 'factionWar',
      name: 'Faction War',
      days: [1, 2, 3, 4], // Mon-Thu
      boosts: {
        reward: 1.3,
        commanderShard: 1.2,
        fleetPower: 1.1,
      },
      description: 'Fight this faction for boosted rewards.'
    },
    {
      key: 'commanderSpotlight',
      name: 'Commander Spotlight',
      days: [4, 5, 6, 0], // Thu-Sun
      boosts: {
        commanderStats: 1.2,
        commanderShard: 1.5,
      },
      description: 'This commander is boosted — use them, earn shards, buy bundles.'
    },
    {
      key: 'sectorSurge',
      name: 'Sector Surge',
      days: [6, 0], // Sat-Sun
      boosts: {
        reward: 1.5,
        enemyPower: 1.2,
        bonusBlueprint: 1
      },
      description: 'One sector is supercharged.'
    },
    {
      key: 'galacticMarket',
      name: 'Galactic Market',
      days: [5, 6, 0], // Fri-Sun
      offers: ['rareAlloy', 'commanderShard', 'techBlueprint', 'shipModule'],
      description: 'Limited-time shop rotation.'
    }
  ],
  monthly: [
    {
      key: 'anomalyStorm',
      name: 'Anomaly Storm',
      durationDays: 3,
      mutators: ['randomHazards', 'doubleRewards', 'uniqueLoot'],
      description: 'Anomalies appear across all sectors.'
    },
    {
      key: 'factionInvasion',
      name: 'Faction Invasion',
      durationDays: 7,
      features: ['temporaryMissions', 'invasionBoss', 'invasionCurrency', 'invasionShop'],
      description: 'A hostile faction invades the galaxy.'
    },
    {
      key: 'legendaryCommanderHunt',
      name: 'Legendary Commander Hunt',
      durationDays: 5,
      features: ['huntMissions', 'huntBoss', 'huntShop', 'huntBundles'],
      description: 'Chase shards for a legendary commander.'
    }
  ],
  seasonal: [
    {
      key: 'seasonalArc',
      name: 'Seasonal Arc',
      durationWeeks: 8,
      features: ['newFaction', 'newLegendaryCommander', 'newShipClass', 'newSeasonalBoss', 'newCurrency', 'newShop', 'newNarrative', 'newMutators', 'cosmeticRewards'],
      description: 'A new season begins.'
    }
  ],
  mutators: [
    'combat:+20% ATK for Destroyers',
    'combat:Cruisers gain shield regen',
    'combat:Frigates explode on death',
    'combat:Battleships take +50% damage from beams',
    'combat:Abilities disabled every 3 turns',
    'env:Ion storms (accuracy penalty)',
    'env:Gravity wells (speed penalty)',
    'env:Radiation pulses (HP drain)',
    'env:Nebula interference (ability cooldown increase)',
    'faction:Wraithbound +20% shield drain',
    'faction:Riftborn +20% burst damage',
    'faction:Obsidian Choir +10% formation buffs',
    'reward:Double shards',
    'reward:Double blueprints',
    'reward:Double modules',
    'reward:Bonus credits',
    'reward:Bonus data'
  ]
};

// --- LiveOps State ---
let activeEvents: any[] = [];

// --- LiveOps Scheduler ---
function getCurrentWeeklyEvents(now = new Date()) {
  const day = now.getDay(); // 0=Sun, 1=Mon, ...
  return LIVEOPS_CONFIG.weekly.filter(e => e.days && e.days.includes(day));
}

function getCurrentMonthlyEvent(now = new Date()) {
  // Example: 1st week anomaly, 2nd week invasion, 3rd week hunt, 4th week reset
  const week = Math.floor((now.getDate() - 1) / 7) + 1;
  if (week === 1) return LIVEOPS_CONFIG.monthly.find(e => e.key === 'anomalyStorm');
  if (week === 2) return LIVEOPS_CONFIG.monthly.find(e => e.key === 'factionInvasion');
  if (week === 3) return LIVEOPS_CONFIG.monthly.find(e => e.key === 'legendaryCommanderHunt');
  // Week 4: quiet/reset (could be a special event or none)
  return null;
}

function getCurrentSeasonalEvent(now = new Date()) {
  // Example: Season 1 always active for now
  return LIVEOPS_CONFIG.seasonal[0];
}

function updateActiveEvents() {
  const now = new Date();
  const weekly = getCurrentWeeklyEvents(now);
  const monthly = getCurrentMonthlyEvent(now);
  const seasonal = getCurrentSeasonalEvent(now);
  activeEvents = [...weekly];
  if (monthly) activeEvents.push(monthly);
  if (seasonal) activeEvents.push(seasonal);
}

// Update events every minute (could be more/less frequent as needed)

// --- PvP Ecosystem API ---
// Declare PvP state only once, after router is initialized
let pvpPlayers: PvPPlayer[] = [];
let pvpBattles: PvPBattle[] = [];

// POST /api/pvp/register - Register or update a PvP player
router.post('/pvp/register', (req, res) => {
  const { userId, username, fleetPower, commanderRarity, defenseFleet } = req.body;
  let player = pvpPlayers.find(p => p.userId === userId);
  if (!player) {
    player = {
      userId,
      username,
      fleetPower,
      commanderRarity,
      rank: 1000,
      division: 'Bronze',
      mmr: 1000,
      winStreak: 0,
      lossStreak: 0,
      defenseFleet,
      attackHistory: [],
      defenseHistory: [],
      currencies: { ArenaToken: 0, CommanderToken: 0, FactionArenaToken: 0, SeasonalPvPToken: 0 },
    };
    pvpPlayers.push(player);
  } else {
    player.username = username;
    player.fleetPower = fleetPower;
    player.commanderRarity = commanderRarity;
    player.defenseFleet = defenseFleet;
  }
  res.json({ success: true, player });
});

// POST /api/pvp/matchmake - Advanced matchmaking logic
router.post('/pvp/matchmake', checkPvPBan, (req, res) => {
  const { userId, mode } = req.body;
  const player = pvpPlayers.find(p => p.userId === userId);
  if (!player) return res.status(404).json({ error: 'Player not found' });

  // Exclude recent opponents (last 5 battles)
  const recentOpponentIds = player.attackHistory.slice(-5).map(b => b.defenderId);

  // Find candidates in same division, not self, not recent opponents, within 200 MMR
  let candidates = pvpPlayers.filter(p =>
    p.userId !== userId &&
    p.division === player.division &&
    !recentOpponentIds.includes(p.userId) &&
    Math.abs(p.mmr - player.mmr) <= 200
  );

  // If none, expand to adjacent divisions (one up/down)
  if (candidates.length === 0) {
    const divisions = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Obsidian'];
    const idx = divisions.indexOf(player.division);
    let adjacentDivs: string[] = [];
    if (idx > 0) adjacentDivs.push(divisions[idx - 1]);
    if (idx < divisions.length - 1) adjacentDivs.push(divisions[idx + 1]);
    candidates = pvpPlayers.filter(p =>
      p.userId !== userId &&
      adjacentDivs.includes(p.division) &&
      !recentOpponentIds.includes(p.userId) &&
      Math.abs(p.mmr - player.mmr) <= 300
    );
  }

  // If still none, fallback to any division, any MMR, not self
  if (candidates.length === 0) {
    candidates = pvpPlayers.filter(p => p.userId !== userId && !recentOpponentIds.includes(p.userId));
  }

  if (candidates.length === 0) return res.status(404).json({ error: 'No opponents found' });

  // Sort by closest MMR, then by lowest win streak (to avoid matching with streaking players)
  candidates.sort((a, b) => {
    const mmrDiff = Math.abs(a.mmr - player.mmr) - Math.abs(b.mmr - player.mmr);
    if (mmrDiff !== 0) return mmrDiff;
    return a.winStreak - b.winStreak;
  });

  const opponent = candidates[0];
  res.json({ opponent: { userId: opponent.userId, username: opponent.username, defenseFleet: opponent.defenseFleet, mmr: opponent.mmr, division: opponent.division } });
});

// POST /api/pvp/battle - Submit PvP battle result
router.post('/pvp/battle', checkPvPBan, (req, res) => {
  const { attackerId, defenderId, mode, result } = req.body;
  const attacker = pvpPlayers.find(p => p.userId === attackerId);
  const defender = pvpPlayers.find(p => p.userId === defenderId);
  if (!attacker || !defender) return res.status(404).json({ error: 'Player not found' });

  // PvP reward tables (could be expanded)
  const divisionRewards: Record<string, { win: number; loss: number }> = {
    Bronze: { win: 10, loss: 3 },
    Silver: { win: 15, loss: 5 },
    Gold: { win: 20, loss: 7 },
    Platinum: { win: 30, loss: 10 },
    Obsidian: { win: 50, loss: 20 },
  };
  const lootTable = [
    { item: 'Credit', min: 100, max: 500 },
    { item: 'Tech Blueprint', min: 1, max: 3 },
    { item: 'Commander Shard', min: 1, max: 2 },
    { item: 'PvP Token', min: 1, max: 5 },
  ];

  // Update MMR, streaks, and rewards
  let mmrChange = 20;
  let rewards: any[] = [];
  let division = attacker.division;
  if (result === 'Win') {
    attacker.mmr += mmrChange;
    attacker.winStreak += 1;
    attacker.lossStreak = 0;
    defender.mmr -= mmrChange;
    defender.winStreak = 0;
    defender.lossStreak += 1;
    // Division reward
    const tokenReward = divisionRewards[division]?.win || 10;
    attacker.currencies.ArenaToken += tokenReward;
    rewards.push({ type: 'ArenaToken', amount: tokenReward });
    // Bonus for win streaks
    if (attacker.winStreak % 5 === 0) {
      rewards.push({ type: 'StreakBonus', amount: 25 });
      attacker.currencies.ArenaToken += 25;
    }
    // Random loot
    lootTable.forEach(loot => {
      if (Math.random() < 0.5) {
        const amount = Math.floor(Math.random() * (loot.max - loot.min + 1)) + loot.min;
        rewards.push({ type: loot.item, amount });
      }
    });
  } else {
    attacker.mmr -= mmrChange;
    attacker.winStreak = 0;
    attacker.lossStreak += 1;
    defender.mmr += mmrChange;
    defender.winStreak += 1;
    defender.lossStreak = 0;
    // Division reward
    const tokenReward = divisionRewards[division]?.loss || 3;
    attacker.currencies.ArenaToken += tokenReward;
    rewards.push({ type: 'ArenaToken', amount: tokenReward });
    // Consolation loot
    if (Math.random() < 0.3) {
      rewards.push({ type: 'Consolation', amount: 1 });
    }
  }

  // Division promotion/demotion (simple)
  if (attacker.mmr > 1200) attacker.division = 'Silver';
  if (attacker.mmr > 1500) attacker.division = 'Gold';
  if (attacker.mmr > 1800) attacker.division = 'Platinum';
  if (attacker.mmr > 2100) attacker.division = 'Obsidian';
  if (attacker.mmr < 1200) attacker.division = 'Bronze';
  if (defender.mmr > 1200) defender.division = 'Silver';
  if (defender.mmr > 1500) defender.division = 'Gold';
  if (defender.mmr > 1800) defender.division = 'Platinum';
  if (defender.mmr > 2100) defender.division = 'Obsidian';
  if (defender.mmr < 1200) defender.division = 'Bronze';

  // Record battle
  const battle: PvPBattle = {
    battleId: Date.now().toString(),
    attackerId,
    defenderId,
    mode,
    result,
    timestamp: Date.now(),
    rewards,
  };
  attacker.attackHistory.push(battle);
  defender.defenseHistory.push(battle);
  pvpBattles.push(battle);
  res.json({ success: true, battle });
});

// GET /api/pvp/leaderboard/:mode - Get PvP leaderboard for a mode
router.get('/pvp/leaderboard/:mode', (req, res) => {
  const { mode } = req.params;
  if (!PVP_MODES.includes(mode as PvPMode)) return res.status(400).json({ error: 'Invalid mode' });
  // Sort by MMR descending
  const leaderboard = pvpPlayers.slice().sort((a, b) => b.mmr - a.mmr).map(p => ({ userId: p.userId, username: p.username, mmr: p.mmr, division: p.division }));
  res.json(leaderboard);
});


// GET /api/pvp/shop/:mode - Get PvP shop for a mode
router.get('/pvp/shop/:mode', (req, res) => {
  const { mode } = req.params;
  if (!PVP_MODES.includes(mode as PvPMode)) return res.status(400).json({ error: 'Invalid mode' });
  res.json(PVP_SHOPS[mode as PvPMode]);
});

export { router };
