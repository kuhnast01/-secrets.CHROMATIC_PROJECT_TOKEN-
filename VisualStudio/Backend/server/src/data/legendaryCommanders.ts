// Legendary Choir Commander: Vor’keth, the Prime Resonant
export const LEGENDARY_COMMANDERS = [
  // WRAITHBOUND (Spectral Pantheon)
  {
    commanderId: 'vor-keth',
    name: "Vor’keth, Prime Resonant",
    faction: 'Obsidian Choir',
    role: 'Resonance Controller / Shield Breaker / Formation Engine',
    status: 'The first Legendary Commander in the canon',
    lore: `Vor’keth is not a singular being. He is a distributed intelligence, a harmonic consciousness woven through the Choir’s ancient war-constructs. When the Choir slumbered, Vor’keth was silent. When the Choir stirred, Vor’keth awoke. He does not speak. He resonates. His presence bends the void, synchronizes Choir formations, and drains the light from enemy shields. He is the first sign that the Choir is not merely reactivating — it is remembering.`,
    visual: {
      appearance: [
        'A towering obsidian construct',
        'Floating above the battlefield',
        'Harmonic rings orbiting his core',
        'Pulses of dark violet energy',
        'Choir glyphs flickering like dying stars'
      ],
      animations: [
        'Resonance waves',
        'Shield-drain beams',
        'Formation harmonics',
        'Darkness distortions'
      ]
    },
    baseStats: {
      commandPower: { min: 500, max: 2500 },
      fleetAtkBonus: { min: 8, max: 20 },
      fleetDefBonus: { min: 6, max: 18 },
      resonanceGeneration: { min: 1, max: 2 },
      shieldDrainEfficiency: { min: 10, max: 30 }
    },
    mechanic: {
      name: 'Resonance (stacking aura)',
      description: 'Choir ships gain +2% ATK and +2% DEF per stack (max 20). Gained when: an enemy shield is drained, a Choir ship takes damage, a Choir ship is destroyed, or Vor’keth uses an ability.'
    },
    passive: {
      name: 'Choir of the Starless',
      effects: [
        'Choir ships gain +5% shield drain',
        'Non-Choir ships gain +5% accuracy in darkness',
        'When an enemy shield hits 0: deal 5% max HP true damage, gain +1 Resonance'
      ]
    },
    abilities: [
      {
        name: 'Obsidian Pulse',
        type: 'active',
        cooldown: 3,
        effects: [
          'Beam damage to all enemies',
          'Drains 15% of all enemy shields',
          'Generates +2 Resonance',
          'If any enemy shield hits 0: Choir ships gain +10% ATK for 2 turns'
        ]
      },
      {
        name: 'Harmonic Convergence',
        type: 'active',
        cooldown: 4,
        effects: [
          'Choir ships gain +20% DEF and +20% shield regen for 2 turns',
          'Non-Choir ships gain +10% ATK for 2 turns',
          'Generates +1 Resonance per Choir ship alive'
        ]
      },
      {
        name: 'Prime Hymn of Ruin',
        type: 'ultimate',
        cooldown: 6,
        requiresResonance: 10,
        effects: [
          'Massive beam damage to primary target',
          'Splash damage to adjacent ships',
          'Drains 30% of all enemy shields',
          'For each enemy with 0 shields: deal 15% max HP true damage, gain +1 Resonance',
          'Choir ships gain +30% ATK for 2 turns'
        ]
      }
    ],
    synergies: [
      'Choir Cruisers',
      'Choir Destroyers',
      'Darkness mutators',
      'Shield-drain modules'
    ],
    counters: [
      'Burst damage fleets',
      'Anti-beam tech',
      'Silence / ability lock'
    ],
    unlockRequirements: [
      'Reach Choir Reputation Level 10 (earned by fighting Choir units)',
      'Complete the Choir Trials (missions: shield drain, darkness, formation synergy)',
      'Collect 10 Choir Relics (dropped from Sector 3 Strongholds, Boss, Seasonal events)',
      'Defeat the Choir Challenge Boss (unique multi-phase encounter)',
      'Spend 500 Choir Tokens (earned from Faction War, Seasonal events, Daily missions)'
    ]
  },
  {
    commanderId: 'hollow-admiral',
    name: 'The Hollow Admiral',
    faction: 'Wraithbound',
    role: 'Stealth / Ambush / Alpha-Strike Specialist',
    rarity: 'Legendary',
    unlockPath: 'Wraithbound Mastery',
    lore: `Before the Wraithbound became spectral constructs, they were a fleet — a real, physical navy that vanished during the Collapse. The Hollow Admiral is the echo of that fleet’s commander, a consciousness reconstructed from corrupted logs, fragmented memories, and spectral data. He is not alive. He is not dead. He is a ghost of command, a tactical mind without a body, a presence that flickers in and out of sensor range. His fleets strike first. His fleets strike unseen. And when he manifests, the void itself seems to hold its breath.`,
    visual: {
      appearance: [
        'A tall, skeletal silhouette made of flickering signal-static',
        'A tattered admiral’s coat rendered in spectral light',
        'A hollow face with no features, only a void',
        'Ghost-ships orbiting him like fragments of memory'
      ],
      animations: [
        'Glitch in and out of existence',
        'Presence feels like a corrupted hologram trying to remember itself'
      ]
    },
    baseStats: {
      commandPower: { min: 450, max: 2300 },
      fleetCritChanceBonus: { min: 5, max: 20 },
      fleetAccuracyBonus: { min: 4, max: 15 },
      stealthDuration: { min: 1, max: 2 },
      ambushDamageBonus: { min: 20, max: 50 }
    },
    mechanic: {
      name: 'Spectral Stealth',
      description: 'Wraithbound ships become untargetable for 1 turn. Their next attack deals bonus ambush damage. Stealth breaks early if they attack. Works even in darkness or hazard zones.'
    },
    passive: {
      name: 'Echoes of Command',
      effects: [
        'First attack each battle deals +30% damage',
        'Fleet gains +10% accuracy against enemies in darkness',
        'When a Wraithbound ship is destroyed: Summon a Spectral Fragment (mini-drone) that deals chip damage and applies -5% DEF'
      ]
    },
    abilities: [
      {
        name: 'Silent Armada',
        type: 'active',
        cooldown: 4,
        effects: [
          'Entire fleet enters Spectral Stealth for 1 turn',
          'Next attack from each ship deals +40% ambush damage',
          'Fleet gains +20% crit chance for 1 turn'
        ]
      },
      {
        name: 'Phantom Volley',
        type: 'active',
        cooldown: 3,
        effects: [
          'All Wraithbound ships fire instantly',
          'Attacks cannot miss',
          'If target is above 50% HP: Deal +25% bonus damage',
          'Generates 1 Spectral Fragment'
        ]
      },
      {
        name: 'The Admiral’s Return',
        type: 'ultimate',
        cooldown: 6,
        requiresFragments: 3,
        effects: [
          'Hollow Admiral manifests fully',
          'Fleet gains +50% crit chance, +50% crit damage, +30% accuracy',
          'All enemies take 20% max HP damage over 2 turns',
          'Summons 2 Elite Spectral Drones that attack automatically'
        ]
      }
    ],
    synergies: [
      'Wraithbound Frigates (high crit, high speed)',
      'Destroyers with ambush modules',
      'Darkness mutators',
      'Shield-drain commanders (Null Harvester)'
    ],
    counters: [
      'High-DEF fleets',
      'Shield-regen fleets',
      'Anti-crit tech',
      'EMP / disable commanders'
    ],
    unlockRequirements: [
      'Reach Wraithbound Reputation Level 10 (earned by defeating Wraithbound enemies)',
      'Complete the Wraithbound Trials (missions: stealth, ambush, darkness synergy)',
      'Collect 10 Wraithbound Relics (dropped from Sector 1 Strongholds, Boss, Seasonal events)',
      'Defeat the Wraithbound Challenge Boss (stealth-based encounter)',
      'Spend 500 Wraith Tokens (earned from Faction War, Daily missions, Seasonal events)'
    ]
  },
  {
    commanderId: 'eclipse-matron',
    name: 'Eclipse Matron',
    faction: 'Wraithbound',
    role: 'Darkness Controller / Debuff Specialist',
    rarity: 'Legendary',
    lore: `The Eclipse Matron is the Wraithbound’s oldest surviving intelligence fragment — a spectral caretaker who once commanded the fleet’s sensor arrays. When the Collapse consumed her ships, she fused with the void itself. She is the one who brings the darkness, bending light, distorting sensors, and smothering enemy targeting systems. Where she walks, stars dim.`,
    visual: {
      appearance: [
        'A tall, robed silhouette made of shadow-static',
        'A halo of eclipsed light behind her head',
        'Her “face” is a black sun'
      ],
      animations: [
        'Solar flares inverted into darkness',
        'Rippling void form'
      ]
    },
    baseStats: {
      commandPower: { min: 480, max: 2400 },
      darknessDuration: { min: 1, max: 3 },
      enemyAccuracyReduction: { min: -10, max: -30 },
      fleetEvasionBonus: { min: 5, max: 15 }
    },
    mechanic: {
      name: 'Eclipse Zones',
      description: 'Creates areas of battlefield darkness that reduce enemy accuracy, increase Wraithbound evasion, boost spectral abilities, and stack with other darkness effects.'
    },
    passive: {
      name: 'Umbra Veil',
      effects: [
        'At battle start, create an Eclipse Zone for 1 turn',
        'Enemies in darkness deal -20% damage',
        'Wraithbound ships gain +10% evasion in darkness'
      ]
    },
    abilities: [
      {
        name: 'Shadow Bloom',
        type: 'active',
        cooldown: 3,
        effects: [
          'Expands Eclipse Zone to all enemies for 1 turn',
          'Reduces enemy accuracy by 25%',
          'Wraithbound ships gain +20% crit chance'
        ]
      },
      {
        name: 'Solar Null',
        type: 'active',
        cooldown: 4,
        effects: [
          'Removes all enemy buffs',
          'Applies Blind (next attack misses)',
          'Extends darkness by 1 turn'
        ]
      },
      {
        name: 'Totality',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Entire battlefield enters darkness for 2 turns',
          'Enemies cannot crit',
          'Wraithbound ships gain +30% evasion, +30% accuracy, +20% damage'
        ]
      }
    ],
    unlockRequirements: [
      'Wraithbound Reputation 12',
      'Eclipse Trials (darkness missions)',
      '12 Eclipse Relics',
      'Eclipse Challenge Boss',
      '600 Wraith Tokens'
    ]
  },
  {
    commanderId: 'null-harvester',
    name: 'The Null Harvester',
    faction: 'Wraithbound',
    role: 'Shield Drain / True Damage Executioner',
    rarity: 'Legendary',
    lore: `The Null Harvester is a spectral construct built for one purpose: consume energy. It drains shields, devours power cores, and converts energy into lethal bursts of true damage. It is the Wraithbound’s executioner.`,
    visual: {
      appearance: [
        'A floating obsidian maw',
        'Tendrils of spectral energy',
        'A core that glows brighter as it drains shields'
      ],
      animations: [
        'Pulses like a heartbeat made of static'
      ]
    },
    baseStats: {
      commandPower: { min: 520, max: 2600 },
      shieldDrainBonus: { min: 15, max: 40 },
      trueDamageConversion: { min: 5, max: 15 },
      executionThreshold: { min: 20, max: 35 }
    },
    mechanic: {
      name: 'Energy Harvest',
      description: 'Whenever an enemy loses shields: convert 10% of drained shields into true damage. Gain Harvest Stacks (max 20). Each stack increases true damage by 1%.'
    },
    passive: {
      name: 'Devour the Light',
      effects: [
        'When an enemy shield hits 0: deal 10% max HP true damage, gain +2 Harvest Stacks',
        'Wraithbound ships gain +10% shield drain'
      ]
    },
    abilities: [
      {
        name: 'Null Beam',
        type: 'active',
        cooldown: 3,
        effects: [
          'Deals beam damage',
          'Drains 20% shields',
          'Converts drained shields into true damage'
        ]
      },
      {
        name: 'Core Rupture',
        type: 'active',
        cooldown: 4,
        effects: [
          'Deals AoE true damage',
          '+50% damage to enemies below 50% shields',
          '+100% damage to enemies with 0 shields'
        ]
      },
      {
        name: 'Harvest Protocol',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Deal 15% max HP true damage to all enemies',
          'If any enemy is below 35% HP: execute instantly',
          'Gain +5 Harvest Stacks'
        ]
      }
    ],
    unlockRequirements: [
      'Wraithbound Reputation 15',
      'Null Trials',
      '15 Null Relics',
      'Null Harvester Boss',
      '700 Wraith Tokens'
    ]
  },
  {
    commanderId: 'spectral-warlord',
    name: 'Spectral Warlord',
    faction: 'Wraithbound',
    role: 'Summoner / Swarm Commander',
    rarity: 'Legendary',
    lore: `The Spectral Warlord is not one being — it is many. A collective of fallen Wraithbound captains fused into a single spectral hive. It commands ghost-drones, spectral fighters, and swarms of autonomous fragments.`,
    visual: {
      appearance: [
        'A shifting mass of spectral faces',
        'Multiple ghost-ships orbiting like a swarm'
      ],
      animations: [
        'Flickers between forms'
      ]
    },
    baseStats: {
      commandPower: { min: 450, max: 2200 },
      droneDamage: { min: 10, max: 30 },
      droneCount: { min: 2, max: 5 },
      swarmSpeed: { min: 5, max: 20 }
    },
    mechanic: {
      name: 'Spectral Drones',
      description: 'Summons drones that auto-attack, explode on death, and apply -5% DEF.'
    },
    passive: {
      name: 'Swarm of Echoes',
      effects: [
        'At battle start, summon 2 drones',
        'When a Wraithbound ship dies: summon 1 drone',
        'Drones explode for AoE damage'
      ]
    },
    abilities: [
      {
        name: 'Wraith Swarm',
        type: 'active',
        cooldown: 3,
        effects: [
          'Summon 2 drones',
          'Drones gain +20% ATK'
        ]
      },
      {
        name: 'Fragment Storm',
        type: 'active',
        cooldown: 4,
        effects: [
          'All drones explode',
          'Deal AoE damage',
          'Apply -10% DEF'
        ]
      },
      {
        name: 'Spectral Ascension',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Summon 3 Elite Drones',
          'Elite drones attack twice, apply -15% DEF, explode for massive damage'
        ]
      }
    ],
    unlockRequirements: [
      'Wraithbound Reputation 18',
      'Swarm Trials',
      '20 Swarm Relics',
      'Spectral Warlord Boss',
      '800 Wraith Tokens'
    ]
  },

  // RIFTBORN MARAUDERS (Riftborn Court)
  {
    commanderId: 'karn-vox',
    name: 'Karn Vox, Rift Warlord',
    faction: 'Riftborn Marauders',
    role: 'Burst Damage / Ambush / Chaos',
    rarity: 'Legendary',
    lore: `Karn Vox is the most feared marauder in the Shattered Veil — a warlord who carved his throne from the wreckage of a fallen dreadnought. He fights with jury-rigged tech, unstable reactors, and brutal efficiency.`,
    visual: {
      appearance: [
        'Heavy armor made of scavenged ship plating',
        'Glowing rift-energy scars',
        'A massive plasma cleaver'
      ],
      animations: [
        'Crackles with unstable energy'
      ]
    },
    baseStats: {
      commandPower: { min: 600, max: 2800 },
      burstDamageBonus: { min: 20, max: 50 },
      ambushDamage: { min: 15, max: 40 },
      critDamage: { min: 20, max: 50 }
    },
    mechanic: {
      name: 'Riftburst',
      description: 'When Karn Vox attacks: deal bonus burst damage. If target is above 50% HP: deal +30% extra damage.'
    },
    passive: {
      name: 'Cut Through the Veil',
      effects: [
        'First attack each battle deals +50% damage',
        'Fleet gains +10% crit damage',
        'When an enemy dies: gain +10% ATK'
      ]
    },
    abilities: [
      {
        name: 'Riftbreaker Charge',
        type: 'active',
        cooldown: 3,
        effects: [
          'Massive single-target burst',
          '+50% damage if target is above 50% HP',
          '+100% damage if target is below 25% HP'
        ]
      },
      {
        name: 'Overload Strike',
        type: 'active',
        cooldown: 4,
        effects: [
          'Deals beam damage',
          'Applies Reactor Overload (DoT)',
          'If target dies while overloaded: explosion deals AoE damage'
        ]
      },
      {
        name: 'Veil Rend',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Tears open a rift: all enemies take 20% max HP damage, -20% DEF, -20% accuracy',
          'Karn Vox gains +50% ATK for 2 turns'
        ]
      }
    ],
    unlockRequirements: [
      'Riftborn Reputation 10',
      'Rift Trials',
      '10 Rift Relics',
      'Karn Vox Boss',
      '500 Rift Tokens'
    ]
  },
  {
    commanderId: 'scrap-king',
    name: 'The Scrap King',
    faction: 'Riftborn Marauders',
    role: 'Drone Swarm / Resource Theft / Attrition Pressure',
    rarity: 'Legendary',
    lore: `The Scrap King rules the drifting junk-fortresses of the Riftborn. He is a tyrant, a genius, and a lunatic — a man who believes every ship is just “future scrap” waiting to be claimed. He commands an army of jury-rigged drones built from the bones of fallen fleets.`,
    visual: {
      appearance: [
        'A massive exo-rig made of welded ship parts',
        'A crown of broken antennae',
        'Drones orbiting him like metal vultures'
      ],
      animations: [
        'Sparks with unstable energy'
      ]
    },
    baseStats: {
      commandPower: { min: 550, max: 2700 },
      droneDamage: { min: 15, max: 40 },
      resourceTheft: { min: 5, max: 15 },
      droneCount: { min: 2, max: 6 }
    },
    mechanic: {
      name: 'Scrap Drones',
      description: 'Scrap drones auto-attack, steal resources on hit, explode on death, and apply -5% DEF.'
    },
    passive: {
      name: 'Junkyard Sovereign',
      effects: [
        'Summon 2 drones at battle start',
        'When an enemy dies: summon 1 drone',
        'When a drone hits: steal credits + alloy'
      ]
    },
    abilities: [
      {
        name: 'Scrap Swarm',
        type: 'active',
        cooldown: 3,
        effects: [
          'Summon 2 drones',
          'Drones gain +20% ATK'
        ]
      },
      {
        name: 'Ruststorm',
        type: 'active',
        cooldown: 4,
        effects: [
          'All drones explode',
          'Deal AoE damage',
          'Apply -15% DEF'
        ]
      },
      {
        name: 'Junkyard Armada',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Summon 4 Elite Scrap Drones',
          'Elite drones attack twice, steal double resources, explode for massive damage'
        ]
      }
    ],
    unlockRequirements: [
      'Riftborn Reputation 12',
      'Scrap Trials',
      '12 Scrap Relics',
      'Scrap King Boss',
      '600 Rift Tokens'
    ]
  },
  {
    commanderId: 'vexa-coil',
    name: 'Vexa Coil',
    faction: 'Riftborn Marauders',
    role: 'EMP / Disable Specialist',
    rarity: 'Legendary',
    lore: `Vexa Coil is a former engineer turned war criminal. She mastered EMP warfare, disabling fleets with a flick of her wrist. She is feared not for her power — but for her precision.`,
    visual: {
      appearance: [
        'A slender figure in a cracked exosuit',
        'EMP coils wrapped around her arms',
        'Sparks of blue-white electricity'
      ],
      animations: [
        'Flickers like overloaded circuits'
      ]
    },
    baseStats: {
      commandPower: { min: 500, max: 2500 },
      disableDuration: { min: 1, max: 2 },
      empDamage: { min: 10, max: 30 },
      abilityLockChance: { min: 20, max: 50 }
    },
    mechanic: {
      name: 'EMP Disruption',
      description: 'Her abilities disable enemy abilities, passives (temporarily), and shield regen.'
    },
    passive: {
      name: 'Coil Static',
      effects: [
        'First enemy to attack each turn is disrupted',
        'Disrupted enemies deal -20% damage, have +20% cooldowns'
      ]
    },
    abilities: [
      {
        name: 'EMP Pulse',
        type: 'active',
        cooldown: 3,
        effects: [
          'Disables one enemy for 1 turn',
          'Removes all buffs',
          'Applies Shock (DoT)'
        ]
      },
      {
        name: 'Overload Field',
        type: 'active',
        cooldown: 4,
        effects: [
          'AoE ability lock',
          'Enemies take +20% damage for 2 turns'
        ]
      },
      {
        name: 'Coil Overload',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Disables all enemy abilities for 1 turn',
          'Removes all shields',
          'Applies Shock to all enemies'
        ]
      }
    ],
    unlockRequirements: [
      'Riftborn Reputation 15',
      'EMP Trials',
      '15 EMP Relics',
      'Vexa Coil Boss',
      '700 Rift Tokens'
    ]
  },
  {
    commanderId: 'gravemind-corsair',
    name: 'Gravemind Corsair',
    faction: 'Riftborn Marauders',
    role: 'Chain Beam / Anti-Swarm / Formation Breaker',
    rarity: 'Legendary',
    lore: `The Gravemind Corsair is a pirate lord who discovered a derelict beam-weapon array and welded it into his flagship. His attacks arc between ships, carving through formations like lightning.`,
    visual: {
      appearance: [
        'A pirate-like silhouette',
        'A massive beam projector strapped to his back'
      ],
      animations: [
        'Arcs between enemies like lightning'
      ]
    },
    baseStats: {
      commandPower: { min: 580, max: 2900 },
      chainBeamDamage: { min: 20, max: 50 },
      bounceCount: { min: 2, max: 5 },
      antiSwarmBonus: { min: 10, max: 30 }
    },
    mechanic: {
      name: 'Arc Beam',
      description: 'Attacks bounce between enemies (up to 5 targets, -20% damage per bounce, apply Burn).'
    },
    passive: {
      name: 'Arc Instinct',
      effects: [
        'First attack each turn bounces +1 extra time',
        'Enemies hit by Arc Beam take +10% more damage'
      ]
    },
    abilities: [
      {
        name: 'Grave Arc',
        type: 'active',
        cooldown: 3,
        effects: [
          'Chain beam hits 3–5 enemies',
          'Applies Burn'
        ]
      },
      {
        name: 'Formation Breaker',
        type: 'active',
        cooldown: 4,
        effects: [
          'Deals AoE damage',
          'Breaks enemy formation bonuses',
          'Applies -20% DEF'
        ]
      },
      {
        name: 'Corsair’s Judgment',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Massive chain beam hits all enemies',
          'Applies Burn',
          'Applies -30% accuracy'
        ]
      }
    ],
    unlockRequirements: [
      'Riftborn Reputation 18',
      'Arc Trials',
      '20 Arc Relics',
      'Gravemind Corsair Boss',
      '800 Rift Tokens'
    ]
  },
  {
    commanderId: 'rift-crown-heir',
    name: 'The Rift Crown Heir',
    faction: 'Riftborn Marauders',
    role: 'Gravity Manipulator / Turn Order Control',
    rarity: 'Legendary (Season 2)',
    lore: `The Rift Crown is an ancient superstructure capable of bending gravity. The Heir is the only living being who can interface with it. He is the future of the Riftborn — or their doom.`,
    visual: {
      appearance: [
        'A young figure floating in a gravity field',
        'Rings of warped space around him'
      ],
      animations: [
        'Distorts the battlefield'
      ]
    },
    baseStats: {
      commandPower: { min: 620, max: 3000 },
      gravitySlow: { min: 10, max: 30 },
      turnOrderManipulation: 'High',
      gravityFieldDuration: { min: 1, max: 3 }
    },
    mechanic: {
      name: 'Gravity Wells',
      description: 'Gravity wells slow enemies, reduce accuracy, delay turn order, and increase damage taken.'
    },
    passive: {
      name: 'Crown’s Burden',
      effects: [
        'Enemies in gravity wells take +15% damage',
        'Allies gain +10% speed'
      ]
    },
    abilities: [
      {
        name: 'Gravity Crush',
        type: 'active',
        cooldown: 3,
        effects: [
          'Deal damage',
          'Apply Slow',
          'Reduce turn order'
        ]
      },
      {
        name: 'Event Drift',
        type: 'active',
        cooldown: 4,
        effects: [
          'Swap turn order of two enemies',
          'Apply -20% accuracy'
        ]
      },
      {
        name: 'Event Horizon',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Freeze enemy turn order for 1 turn',
          'Apply Slow to all enemies',
          'Allies gain +30% speed'
        ]
      }
    ],
    unlockRequirements: [
      'Riftborn Reputation 20',
      'Crown Trials',
      '25 Crown Relics',
      'Rift Crown Heir Boss',
      '1000 Rift Tokens'
    ]
  },

  // OBSIDIAN CHOIR (Choir Ascendant)
  {
    commanderId: 'vor-keth-choir',
    name: "Vor’keth, Prime Resonant",
    faction: 'Obsidian Choir',
    role: 'Resonance Controller',
    mechanic: 'Resonance stacking',
    meta: 'The Choir’s awakening made manifest',
    unlockPaths: ['Season 1 Hunt', 'Legendary Shop', 'Boss Drop: Choir Prime Echo']
  },
  {
    commanderId: 'choir-architect',
    name: 'The Choir Architect',
    faction: 'Obsidian Choir',
    role: 'Formation Specialist / Positioning Master',
    rarity: 'Legendary',
    lore: `The Choir Architect is the mind that designed the Choir’s ancient battle formations. He sees war as geometry — angles, harmonics, and perfect symmetry. He rearranges fleets like pieces on a cosmic board.`,
    visual: {
      appearance: [
        'A tall construct with geometric rings',
        'Holographic formation grids orbit him'
      ],
      animations: [
        'Shifts ships into new positions'
      ]
    },
    baseStats: {
      commandPower: { min: 500, max: 2500 },
      formationBonus: { min: 10, max: 30 },
      positionSwapCooldown: { min: 3, max: 2 },
      resonanceGain: { min: 1, max: 2 }
    },
    mechanic: {
      name: 'Formation Geometry',
      description: 'Grants bonuses based on formation shape: Line (+ATK), Wedge (+Crit), Shield Wall (+DEF), Spread (+Evasion).'
    },
    passive: {
      name: 'Perfect Lines',
      effects: [
        'Choir ships gain +10% formation bonuses',
        'When formation changes: gain +1 Resonance'
      ]
    },
    abilities: [
      {
        name: 'Reposition',
        type: 'active',
        cooldown: 3,
        effects: [
          'Swap positions of two ships',
          'Apply +10% ATK to both'
        ]
      },
      {
        name: 'Harmonic Shift',
        type: 'active',
        cooldown: 4,
        effects: [
          'Change formation type mid-battle',
          'Apply +20% DEF for 1 turn'
        ]
      },
      {
        name: 'Perfect Geometry',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Double all formation bonuses for 2 turns',
          'Gain +5 Resonance',
          'Choir ships gain +20% ATK'
        ]
      }
    ],
    unlockRequirements: [
      'Choir Reputation 10',
      'Formation Trials',
      '10 Architect Relics',
      'Choir Architect Boss',
      '500 Choir Tokens'
    ]
  },
  {
    commanderId: 'obsidian-oracle',
    name: 'The Obsidian Oracle',
    faction: 'Obsidian Choir',
    role: 'Predictive Defense / Counterattacks / Anti-Alpha-Strike',
    rarity: 'Legendary',
    lore: `The Obsidian Oracle is a Choir construct built to predict enemy movements before they occur. Its consciousness spans micro-timelines, analyzing thousands of possible futures every second. It does not dodge attacks. It simply was never there when the attack landed.`,
    visual: {
      appearance: [
        'A floating obsidian sphere with shifting fractal patterns',
        'Multiple “eyes” that open and close across its surface'
      ],
      animations: [
        'Rewinds slightly before attacks land'
      ]
    },
    baseStats: {
      commandPower: { min: 520, max: 2700 },
      counterattackChance: { min: 20, max: 50 },
      predictiveDodge: { min: 10, max: 30 },
      damageReflection: { min: 5, max: 15 }
    },
    mechanic: {
      name: 'Foresight',
      description: 'At the start of each turn: predicts the first enemy attack, automatically dodges it, and counterattacks with beam damage.'
    },
    passive: {
      name: 'Foreseen Strike',
      effects: [
        'First attack each turn is dodged',
        'Counterattack deals +30% damage',
        'Choir ships gain +10% DEF'
      ]
    },
    abilities: [
      {
        name: 'Echo Guard',
        type: 'active',
        cooldown: 3,
        effects: [
          'Grants Predictive Dodge to 2 allies',
          'Applies +20% DEF',
          'Applies +20% accuracy'
        ]
      },
      {
        name: 'Temporal Fracture',
        type: 'active',
        cooldown: 4,
        effects: [
          'Deals beam damage',
          'Applies Slow',
          'Applies -20% crit chance'
        ]
      },
      {
        name: 'Prophetic Ruin',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Entire fleet gains guaranteed crits for 2 turns, +30% accuracy, +20% speed',
          'Enemies lose 20% DEF, 20% accuracy'
        ]
      }
    ],
    unlockRequirements: [
      'Choir Reputation 12',
      'Oracle Trials',
      '12 Oracle Relics',
      'Obsidian Oracle Boss',
      '600 Choir Tokens'
    ]
  },
  {
    commanderId: 'resonant-warden',
    name: 'The Resonant Warden',
    faction: 'Obsidian Choir',
    role: 'Tank / Shield Regen / Resonance Conversion',
    rarity: 'Legendary',
    lore: `The Resonant Warden is the Choir’s ancient guardian — a construct built to protect the Choir’s core harmonics. It converts Resonance into impenetrable shields. Where Vor’keth is the Choir’s voice, the Warden is its wall.`,
    visual: {
      appearance: [
        'A massive armored construct',
        'Shield plates that shift like tectonic plates',
        'Resonance rings orbiting its core'
      ]
    },
    baseStats: {
      commandPower: { min: 650, max: 3200 },
      shieldRegen: { min: 20, max: 50 },
      resonanceConversion: { min: 1, max: 3 },
      damageReduction: { min: 10, max: 25 }
    },
    mechanic: {
      name: 'Resonant Shielding',
      description: 'Converts Resonance stacks into shield regen, damage reduction, and temporary overshields.'
    },
    passive: {
      name: 'Harmonic Bulwark',
      effects: [
        'Choir ships gain +10% shield regen',
        'When Resonance increases: Warden gains +5% damage reduction (max 25%)'
      ]
    },
    abilities: [
      {
        name: 'Shield Pulse',
        type: 'active',
        cooldown: 3,
        effects: [
          'Restore 20% shields to all allies',
          'Gain +1 Resonance'
        ]
      },
      {
        name: 'Resonant Guard',
        type: 'active',
        cooldown: 4,
        effects: [
          'Apply +30% DEF to all allies',
          'Convert 2 Resonance into overshields'
        ]
      },
      {
        name: 'Harmonic Fortress',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Convert all Resonance into: +50% shield regen, +30% DEF, +20% damage reduction (lasts 2 turns)'
        ]
      }
    ],
    unlockRequirements: [
      'Choir Reputation 15',
      'Warden Trials',
      '15 Warden Relics',
      'Resonant Warden Boss',
      '700 Choir Tokens'
    ]
  },
  {
    commanderId: 'starless-cantor',
    name: 'The Starless Cantor',
    faction: 'Obsidian Choir',
    role: 'Darkness + AoE Resonance / Battlefield Control',
    rarity: 'Legendary',
    lore: `The Starless Cantor is a Choir construct that sings in frequencies no living being can hear. Its song extinguishes starlight, deepens darkness, and amplifies Resonance. It is the Choir’s hymn made manifest.`,
    visual: {
      appearance: [
        'A floating Choir construct with a glowing “mouth” of light',
        'Emits harmonic waves that distort the battlefield'
      ],
      animations: [
        'Darkness ripples outward with each animation'
      ]
    },
    baseStats: {
      commandPower: { min: 540, max: 2800 },
      darknessDuration: { min: 1, max: 3 },
      resonanceGain: { min: 1, max: 3 },
      aoeDamage: { min: 10, max: 30 }
    },
    mechanic: {
      name: 'Starless Fields',
      description: 'Creates darkness zones that increase Resonance gain, reduce enemy accuracy, and boost Choir damage.'
    },
    passive: {
      name: 'Canticle of Dusk',
      effects: [
        'When darkness is applied: gain +1 Resonance, enemies lose 10% accuracy'
      ]
    },
    abilities: [
      {
        name: 'Void Hymn',
        type: 'active',
        cooldown: 3,
        effects: [
          'Apply darkness to all enemies',
          'Deal AoE damage',
          'Gain +2 Resonance'
        ]
      },
      {
        name: 'Harmonic Echo',
        type: 'active',
        cooldown: 4,
        effects: [
          'Deal AoE damage',
          'Damage increases by 5% per Resonance'
        ]
      },
      {
        name: 'Canticle of Oblivion',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Massive AoE damage',
          'Apply darkness for 2 turns',
          'Gain +5 Resonance',
          'Choir ships gain +20% ATK'
        ]
      }
    ],
    unlockRequirements: [
      'Choir Reputation 18',
      'Cantor Trials',
      '20 Cantor Relics',
      'Starless Cantor Boss',
      '800 Choir Tokens'
    ]
  },

  // FINAL LEGENDARY: STARLESS ARCHON
  {
    commanderId: 'starless-archon',
    name: 'The Starless Archon',
    faction: 'Obsidian Choir',
    role: 'Multi-Phase Boss-Tier Commander / Ultimate Resonance Engine',
    rarity: 'Legendary+ (Season Finale)',
    lore: `The Starless Archon is the Choir’s supreme construct — the one who commanded the Choir during the ancient war. It is not meant to awaken. If it does, the galaxy will tremble.`,
    visual: {
      appearance: [
        'A colossal Choir construct',
        'Multiple resonance rings',
        'A core that pulses like a dying star'
      ],
      animations: [
        'Shifts between phases'
      ]
    },
    baseStats: {
      commandPower: { min: 800, max: 3500 },
      resonanceGain: { min: 2, max: 4 },
      aoeDamage: { min: 20, max: 50 },
      damageReduction: { min: 15, max: 30 }
    },
    mechanic: {
      name: 'Ascension Phases',
      description: 'Shifts phases at 10, 15, and 20 Resonance: Phase 1 — Harmonic (+20% ATK, +20% DEF); Phase 2 — Resonant (AoE damage every turn, +2 Resonance/turn); Phase 3 — Starless (Darkness every turn, +30% damage); Phase 4 — Archon (All Choir ships gain +50% ATK/DEF/accuracy).'
    },
    passive: {
      name: 'The Choir Ascendant',
      effects: [
        'Gain +1 Resonance every turn',
        'Choir ships gain +5% ATK per phase'
      ]
    },
    abilities: [
      {
        name: 'Resonant Collapse',
        type: 'active',
        cooldown: 3,
        effects: [
          'AoE damage',
          'Apply -20% DEF',
          'Gain +1 Resonance'
        ]
      },
      {
        name: 'Starless Pulse',
        type: 'active',
        cooldown: 4,
        effects: [
          'Apply darkness',
          'Deal AoE damage',
          'Reduce enemy accuracy by 20%'
        ]
      },
      {
        name: 'The Final Hymn',
        type: 'ultimate',
        cooldown: 6,
        effects: [
          'Massive AoE damage',
          'Apply darkness for 2 turns',
          'Gain +5 Resonance',
          'Trigger Ascension Phase immediately'
        ]
      }
    ],
    unlockRequirements: [
      'Choir Reputation 25',
      'Archon Trials',
      '30 Archon Relics',
      'Starless Archon Boss',
      '2000 Choir Tokens'
    ]
  }
];
