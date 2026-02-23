import { Commander } from './Commander';
import { ShipInstance } from './Ship';

export interface Fleet {
  commander: Commander;
  ships: ShipInstance[];
  totalPower: number;
}
