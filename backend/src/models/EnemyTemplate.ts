import { ShipInstance } from './Ship';
import { Ability } from './Commander';

export interface EnemyTemplate {
  id: string;
  faction: string;
  ships: ShipInstance[];
  modifiers: Record<string, number>;
  anomaly: object | null;
  bossAbility: Ability | null;
}
