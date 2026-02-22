// Legendary Commander Unlock Missions (Full Design)
// Each legendary commander has a 3-mission unlock chain with mutators, enemy comps, and rewards

export interface LegendaryUnlockMissionFull {
  description: string;
  mutator?: string;
  enemy?: string;
  reward: string;
}

export interface LegendaryUnlockChainFull {
  commander: string;
  title: string;
  faction: string;
  missions: LegendaryUnlockMissionFull[];
}

export const LEGENDARY_UNLOCK_CHAINS_FULL: LegendaryUnlockChainFull[] = [
  // WRAITHBOUND
  {
    commander: "Vor’Keth",
    title: "The First Resonance",
    faction: "Wraithbound",
    missions: [
      { description: "Drain 50% shields", mutator: "Shield Regen +20%", reward: "2 Harmonic Nodes" },
      { description: "Win in darkness", mutator: "Darkness lasts 2 turns", reward: "3 Wraith Relics" },
      { description: "Defeat Choir Echo boss", enemy: "Choir Echo", reward: "Vor’Keth Shards ×10" }
    ]
  },
  {
    commander: "Hollow Admiral",
    title: "Silent Armada",
    faction: "Wraithbound",
    missions: [
      { description: "Win without taking hull damage", reward: "" },
      { description: "Ambush kill 2 ships", reward: "" },
      { description: "Defeat Silent Dreadnought", enemy: "Silent Dreadnought", reward: "Hollow Admiral Shards ×10" }
    ]
  },
  {
    commander: "Eclipse Matron",
    title: "Totality",
    faction: "Wraithbound",
    missions: [
      { description: "Apply darkness 3 times", reward: "" },
      { description: "Win with 80% fleet HP", reward: "" },
      { description: "Defeat Eclipse Warden", enemy: "Eclipse Warden", reward: "Matron Shards ×10" }
    ]
  },
  {
    commander: "Null Harvester",
    title: "Devour the Light",
    faction: "Wraithbound",
    missions: [
      { description: "Drain 100% shields", reward: "" },
      { description: "Deal 20% true damage", reward: "" },
      { description: "Defeat Null Titan", enemy: "Null Titan", reward: "Harvester Shards ×10" }
    ]
  },
  {
    commander: "Spectral Warlord",
    title: "Swarm of the Fallen",
    faction: "Wraithbound",
    missions: [
      { description: "Summon 5 drones", reward: "" },
      { description: "Explode 3 drones", reward: "" },
      { description: "Defeat Swarm Host", enemy: "Swarm Host", reward: "Warlord Shards ×10" }
    ]
  },
  // RIFTBORN
  {
    commander: "Karn Vox",
    title: "Riftbreaker",
    faction: "Riftborn",
    missions: [
      { description: "Deal 50% burst damage", reward: "" },
      { description: "Kill an enemy above 50% HP", reward: "" },
      { description: "Defeat Riftbreaker Hulk", enemy: "Riftbreaker Hulk", reward: "Karn Vox Shards ×10" }
    ]
  },
  {
    commander: "Scrap King",
    title: "Junkyard Sovereign",
    faction: "Riftborn",
    missions: [
      { description: "Summon 4 drones", reward: "" },
      { description: "Steal 500 resources", reward: "" },
      { description: "Defeat Scrap Colossus", enemy: "Scrap Colossus", reward: "Scrap King Shards ×10" }
    ]
  },
  {
    commander: "Vexa Coil",
    title: "EMP Witch",
    faction: "Riftborn",
    missions: [
      { description: "Disable 3 enemies", reward: "" },
      { description: "Remove 5 buffs", reward: "" },
      { description: "Defeat Coil Overlord", enemy: "Coil Overlord", reward: "Vexa Coil Shards ×10" }
    ]
  },
  {
    commander: "Gravemind Corsair",
    title: "Arc of Ruin",
    faction: "Riftborn",
    missions: [
      { description: "Hit 5 enemies with chain beam", reward: "" },
      { description: "Apply Burn 3 times", reward: "" },
      { description: "Defeat Arc Warden", enemy: "Arc Warden", reward: "Corsair Shards ×10" }
    ]
  },
  {
    commander: "Rift Crown Heir",
    title: "Event Horizon",
    faction: "Riftborn",
    missions: [
      { description: "Slow 3 enemies", reward: "" },
      { description: "Manipulate turn order", reward: "" },
      { description: "Defeat Gravity Sentinel", enemy: "Gravity Sentinel", reward: "Heir Shards ×10" }
    ]
  },
  // OBSIDIAN CHOIR
  {
    commander: "Choir Architect",
    title: "Perfect Geometry",
    faction: "Obsidian Choir",
    missions: [
      { description: "Change formation 3 times", reward: "" },
      { description: "Gain 5 Resonance", reward: "" },
      { description: "Defeat Formation Guardian", enemy: "Formation Guardian", reward: "Architect Shards ×10" }
    ]
  },
  {
    commander: "Obsidian Oracle",
    title: "Foreseen Strike",
    faction: "Obsidian Choir",
    missions: [
      { description: "Dodge 3 attacks", reward: "" },
      { description: "Counterattack twice", reward: "" },
      { description: "Defeat Oracle Echo", enemy: "Oracle Echo", reward: "Oracle Shards ×10" }
    ]
  },
  {
    commander: "Resonant Warden",
    title: "Harmonic Bulwark",
    faction: "Obsidian Choir",
    missions: [
      { description: "Restore 50% shields", reward: "" },
      { description: "Gain 10 Resonance", reward: "" },
      { description: "Defeat Warden Construct", enemy: "Warden Construct", reward: "Warden Shards ×10" }
    ]
  },
  {
    commander: "Starless Cantor",
    title: "Canticle of Oblivion",
    faction: "Obsidian Choir",
    missions: [
      { description: "Apply darkness 3 times", reward: "" },
      { description: "Deal AoE damage 3 times", reward: "" },
      { description: "Defeat Cantor Fragment", enemy: "Cantor Fragment", reward: "Cantor Shards ×10" }
    ]
  },
  {
    commander: "Starless Archon",
    title: "Ascension",
    faction: "Obsidian Choir",
    missions: [
      { description: "Reach Phase 2", reward: "" },
      { description: "Reach Phase 3", reward: "" },
      { description: "Defeat Archon Echo", enemy: "Archon Echo", reward: "Archon Shards ×10" }
    ]
  }
];
