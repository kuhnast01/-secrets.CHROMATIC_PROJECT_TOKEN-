export enum MissionType {
  Skirmish = 'Skirmish',
  Stronghold = 'Stronghold',
  Anomaly = 'Anomaly',
  Boss = 'Boss',
}

export interface Mission {
  id: string;
  sector: string;
  type: MissionType;
  recommendedPower: number;
  enemyTemplateId: string;
  rewardMultiplier: number;
}
