export enum ShipClass {
  Frigate = 'Frigate',
  Destroyer = 'Destroyer',
  Cruiser = 'Cruiser',
  Battleship = 'Battleship',
  Carrier = 'Carrier',
}

export interface Ship {
  id: string;
  class: ShipClass;
  level: number;
  stats: {
    atk: number;
    def: number;
    hp: number;
    spd: number;
    crit: number;
    critDmg: number;
  };
  capacityCost: number;
}

export interface ShipInstance extends Ship {
  instanceId: string;
}
