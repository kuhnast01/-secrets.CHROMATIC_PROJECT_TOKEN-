export enum CommanderRarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

export enum CommanderRole {
  Tactician = 'Tactician',
  Engineer = 'Engineer',
  Warrior = 'Warrior',
  Scientist = 'Scientist',
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  basePower: number;
  scaling: number;
}

export interface Commander {
  id: string;
  rarity: CommanderRarity;
  role: CommanderRole;
  statModifiers: Record<string, number>;
  passive: Ability;
  ultimate: Ability;
  shardRequirements: Record<CommanderRarity, number>;
}
