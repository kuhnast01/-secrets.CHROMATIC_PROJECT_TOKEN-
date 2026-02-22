// Legendary Commander Unlock Missions
// Each legendary commander has a 3-mission unlock chain

export interface LegendaryUnlockMission {
  mission: string;
  description: string;
}

export interface LegendaryUnlockChain {
  commander: string;
  title: string;
  missions: LegendaryUnlockMission[];
  faction: string;
}

export const LEGENDARY_UNLOCK_CHAINS: LegendaryUnlockChain[] = [
  // WRAITHBOUND
  {
    commander: "Vor’Keth",
    title: "The First Resonance",
    faction: "Wraithbound",
    missions: [
      { mission: "Mission 1", description: "Drain 50% of enemy shields" },
      { mission: "Mission 2", description: "Win in darkness" },
      { mission: "Mission 3", description: "Defeat the Choir Echo boss" }
    ]
  },
  {
    commander: "Hollow Admiral",
    title: "Silent Armada",
    faction: "Wraithbound",
    missions: [
      { mission: "Mission 1", description: "Win without taking damage" },
      { mission: "Mission 2", description: "Ambush kill 2 ships" },
      { mission: "Mission 3", description: "Defeat the Wraithbound Dreadnought" }
    ]
  },
  {
    commander: "Eclipse Matron",
    title: "Totality",
    faction: "Wraithbound",
    missions: [
      { mission: "Mission 1", description: "Apply darkness 3 times" },
      { mission: "Mission 2", description: "Win with 80% fleet HP" },
      { mission: "Mission 3", description: "Defeat the Eclipse Warden" }
    ]
  },
  {
    commander: "Null Harvester",
    title: "Devour the Light",
    faction: "Wraithbound",
    missions: [
      { mission: "Mission 1", description: "Drain 100% shields" },
      { mission: "Mission 2", description: "Deal 20% true damage" },
      { mission: "Mission 3", description: "Defeat the Null Titan" }
    ]
  },
  {
    commander: "Spectral Warlord",
    title: "Swarm of the Fallen",
    faction: "Wraithbound",
    missions: [
      { mission: "Mission 1", description: "Summon 5 drones" },
      { mission: "Mission 2", description: "Explode 3 drones" },
      { mission: "Mission 3", description: "Defeat the Swarm Host" }
    ]
  },
  // RIFTBORN
  {
    commander: "Karn Vox",
    title: "Riftbreaker",
    faction: "Riftborn",
    missions: [
      { mission: "Mission 1", description: "Deal 50% burst damage" },
      { mission: "Mission 2", description: "Kill an enemy above 50% HP" },
      { mission: "Mission 3", description: "Defeat the Riftbreaker Hulk" }
    ]
  },
  {
    commander: "Scrap King",
    title: "Junkyard Sovereign",
    faction: "Riftborn",
    missions: [
      { mission: "Mission 1", description: "Summon 4 drones" },
      { mission: "Mission 2", description: "Steal 500 resources" },
      { mission: "Mission 3", description: "Defeat the Scrap Colossus" }
    ]
  },
  {
    commander: "Vexa Coil",
    title: "EMP Witch",
    faction: "Riftborn",
    missions: [
      { mission: "Mission 1", description: "Disable 3 enemies" },
      { mission: "Mission 2", description: "Remove 5 buffs" },
      { mission: "Mission 3", description: "Defeat the Coil Overlord" }
    ]
  },
  {
    commander: "Gravemind Corsair",
    title: "Arc of Ruin",
    faction: "Riftborn",
    missions: [
      { mission: "Mission 1", description: "Hit 5 enemies with chain beam" },
      { mission: "Mission 2", description: "Apply Burn 3 times" },
      { mission: "Mission 3", description: "Defeat the Arc Warden" }
    ]
  },
  {
    commander: "Rift Crown Heir",
    title: "Event Horizon",
    faction: "Riftborn",
    missions: [
      { mission: "Mission 1", description: "Slow 3 enemies" },
      { mission: "Mission 2", description: "Manipulate turn order" },
      { mission: "Mission 3", description: "Defeat the Gravity Sentinel" }
    ]
  },
  // OBSIDIAN CHOIR
  {
    commander: "Choir Architect",
    title: "Perfect Geometry",
    faction: "Obsidian Choir",
    missions: [
      { mission: "Mission 1", description: "Change formation 3 times" },
      { mission: "Mission 2", description: "Gain 5 Resonance" },
      { mission: "Mission 3", description: "Defeat the Formation Guardian" }
    ]
  },
  {
    commander: "Obsidian Oracle",
    title: "Foreseen Strike",
    faction: "Obsidian Choir",
    missions: [
      { mission: "Mission 1", description: "Dodge 3 attacks" },
      { mission: "Mission 2", description: "Counterattack twice" },
      { mission: "Mission 3", description: "Defeat the Oracle Echo" }
    ]
  },
  {
    commander: "Resonant Warden",
    title: "Harmonic Bulwark",
    faction: "Obsidian Choir",
    missions: [
      { mission: "Mission 1", description: "Restore 50% shields" },
      { mission: "Mission 2", description: "Gain 10 Resonance" },
      { mission: "Mission 3", description: "Defeat the Warden Construct" }
    ]
  },
  {
    commander: "Starless Cantor",
    title: "Canticle of Oblivion",
    faction: "Obsidian Choir",
    missions: [
      { mission: "Mission 1", description: "Apply darkness 3 times" },
      { mission: "Mission 2", description: "Deal AoE damage 3 times" },
      { mission: "Mission 3", description: "Defeat the Cantor Fragment" }
    ]
  },
  {
    commander: "Starless Archon",
    title: "Ascension",
    faction: "Obsidian Choir",
    missions: [
      { mission: "Mission 1", description: "Reach Phase 2" },
      { mission: "Mission 2", description: "Reach Phase 3" },
      { mission: "Mission 3", description: "Defeat the Archon Echo" }
    ]
  }
];
