// Commander Synergy Charts
// Shows how each commander interacts with others in their faction

export interface CommanderSynergy {
  commander: string;
  synergizesWith: string[];
  reason: string;
  faction: string;
}

export const COMMANDER_SYNERGY_CHARTS: CommanderSynergy[] = [
  // WRAITHBOUND
  {
    commander: "Vor’Keth",
    synergizesWith: ["Eclipse Matron", "Null Harvester"],
    reason: "Resonance + darkness + shield drain",
    faction: "Wraithbound"
  },
  {
    commander: "Hollow Admiral",
    synergizesWith: ["Spectral Warlord"],
    reason: "Stealth + swarm alpha strike",
    faction: "Wraithbound"
  },
  {
    commander: "Eclipse Matron",
    synergizesWith: ["Vor’Keth"],
    reason: "Darkness boosts Resonance",
    faction: "Wraithbound"
  },
  {
    commander: "Null Harvester",
    synergizesWith: ["Vor’Keth"],
    reason: "Shield drain → Resonance",
    faction: "Wraithbound"
  },
  {
    commander: "Spectral Warlord",
    synergizesWith: ["Hollow Admiral"],
    reason: "Drones benefit from ambush",
    faction: "Wraithbound"
  },
  // RIFTBORN
  {
    commander: "Karn Vox",
    synergizesWith: ["Vexa Coil"],
    reason: "Disable → burst",
    faction: "Riftborn"
  },
  {
    commander: "Scrap King",
    synergizesWith: ["Gravemind Corsair"],
    reason: "Swarm + chain beam",
    faction: "Riftborn"
  },
  {
    commander: "Vexa Coil",
    synergizesWith: ["Karn Vox"],
    reason: "EMP → burst",
    faction: "Riftborn"
  },
  {
    commander: "Gravemind Corsair",
    synergizesWith: ["Scrap King"],
    reason: "Swarm → chain beam",
    faction: "Riftborn"
  },
  {
    commander: "Rift Crown Heir",
    synergizesWith: ["Karn Vox", "Scrap King", "Vexa Coil", "Gravemind Corsair"],
    reason: "Gravity → universal damage boost",
    faction: "Riftborn"
  },
  // OBSIDIAN CHOIR
  {
    commander: "Vor’Keth",
    synergizesWith: ["Choir Architect", "Obsidian Oracle", "Resonant Warden", "Starless Cantor", "Starless Archon"],
    reason: "Resonance is universal",
    faction: "Obsidian Choir"
  },
  {
    commander: "Choir Architect",
    synergizesWith: ["Resonant Warden"],
    reason: "Formation + sustain",
    faction: "Obsidian Choir"
  },
  {
    commander: "Obsidian Oracle",
    synergizesWith: ["Starless Cantor"],
    reason: "Darkness + prediction",
    faction: "Obsidian Choir"
  },
  {
    commander: "Resonant Warden",
    synergizesWith: ["Vor’Keth"],
    reason: "Resonance → shields",
    faction: "Obsidian Choir"
  },
  {
    commander: "Starless Cantor",
    synergizesWith: ["Vor’Keth"],
    reason: "Darkness → Resonance",
    faction: "Obsidian Choir"
  }
];
