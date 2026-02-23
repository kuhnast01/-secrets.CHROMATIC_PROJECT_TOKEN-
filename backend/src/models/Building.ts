import { ResourceType } from './Resource';

export enum BuildingType {
  Generator = 'Generator',
  Shipyard = 'Shipyard',
  ResearchLab = 'ResearchLab',
  Storage = 'Storage',
}

export interface Building {
  id: string;
  type: BuildingType;
  level: number;
  resourceGeneration: Partial<Record<ResourceType, number>>;
  unlocks: string[];
}
