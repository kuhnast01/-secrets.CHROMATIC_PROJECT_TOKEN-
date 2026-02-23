// Commander Synergy Matrix (Full)
// Expanded synergy matrix for all legendary commanders

export interface CommanderSynergyMatrixEntry {
  commander: string;
  worksBestWith: string[];
  reason: string;
  faction: string;
}

export const COMMANDER_SYNERGY_MATRIX: CommanderSynergyMatrixEntry[] = [
  // WRAITHBOUND
  {
    commander: "Vor’Keth",
    worksBestWith: ["Eclipse Matron", "Null Harvester"],
    reason: "Darkness + shield drain → Resonance engine",
    faction: "Wraithbound"
  },
  {
    commander: "Hollow Admiral",
    worksBestWith: ["Spectral Warlord"],
    reason: "Stealth + swarm alpha strike",
    faction: "Wraithbound"
  },
  {
    commander: "Eclipse Matron",
    worksBestWith: ["Vor’Keth"],
    reason: "Darkness boosts Resonance",
    faction: "Wraithbound"
  },
  {
    commander: "Null Harvester",
    worksBestWith: ["Vor’Keth"],
    reason: "Shield drain → true damage",
    faction: "Wraithbound"
  },
  {
    commander: "Spectral Warlord",
    worksBestWith: ["Hollow Admiral"],
    reason: "Drones benefit from ambush",
    faction: "Wraithbound"
  },
  // RIFTBORN
  {
    commander: "Karn Vox",
    worksBestWith: ["Vexa Coil"],
    reason: "Disable → burst",
    faction: "Riftborn"
  },
  {
    commander: "Scrap King",
    worksBestWith: ["Gravemind Corsair"],
    reason: "Swarm → chain beam",
    faction: "Riftborn"
  },
  {
    commander: "Vexa Coil",
    worksBestWith: ["Karn Vox"],
    reason: "EMP → burst",
    faction: "Riftborn"
  },
  {
    commander: "Gravemind Corsair",
    worksBestWith: ["Scrap King"],
    reason: "Swarm → chain beam",
    faction: "Riftborn"
  },
  {
    commander: "Rift Crown Heir",
    worksBestWith: ["Karn Vox", "Scrap King", "Vexa Coil", "Gravemind Corsair"],
    reason: "Gravity → universal damage boost",
    faction: "Riftborn"
  },
  // OBSIDIAN CHOIR
  {
    commander: "Vor’Keth",
    worksBestWith: ["Choir Architect", "Obsidian Oracle", "Resonant Warden", "Starless Cantor", "Starless Archon"],
    reason: "Resonance is universal",
    faction: "Obsidian Choir"
  },
  {
    commander: "Choir Architect",
    worksBestWith: ["Resonant Warden"],
    reason: "Formation + sustain",
    faction: "Obsidian Choir"
  },
  {
    commander: "Obsidian Oracle",
    worksBestWith: ["Starless Cantor"],
    reason: "Darkness + prediction",
    faction: "Obsidian Choir"
  },
  {
    commander: "Resonant Warden",
    worksBestWith: ["Vor’Keth"],
    reason: "Resonance → shields",
    faction: "Obsidian Choir"
  },
  {
    commander: "Starless Cantor",
    worksBestWith: ["Vor’Keth"],
    reason: "Darkness → Resonance",
    faction: "Obsidian Choir"
  }
];
