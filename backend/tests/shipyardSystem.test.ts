import { ShipyardSystem } from '../src/systems/ShipyardSystem';
import { ShipClass, Ship } from '../src/models/Ship';

describe('ShipyardSystem', () => {
  const baseShip: Ship = {
    id: 'frigate_1',
    class: ShipClass.Frigate,
    level: 1,
    stats: { atk: 10, def: 5, hp: 100, spd: 10, crit: 0.1, critDmg: 1.5 },
    capacityCost: 1,
  };

  it('builds a new ship if allowed by shipyard level', () => {
    const sys = new ShipyardSystem(2);
    const ship = sys.buildShip({ ...baseShip, level: 2 });
    expect(ship).not.toBeNull();
    expect(sys.ships.length).toBe(1);
  });

  it('prevents building ship above shipyard level', () => {
    const sys = new ShipyardSystem(1);
    const ship = sys.buildShip({ ...baseShip, level: 2 });
    expect(ship).toBeNull();
    expect(sys.ships.length).toBe(0);
  });

  it('upgrades a ship if allowed', () => {
    const sys = new ShipyardSystem(3);
    const ship = sys.buildShip({ ...baseShip, level: 1 });
    expect(ship).not.toBeNull();
    expect(sys.upgradeShip(ship!.instanceId)).toBe(true);
    expect(sys.ships[0].level).toBe(2);
  });

  it('prevents upgrading above shipyard level', () => {
    const sys = new ShipyardSystem(2);
    const ship = sys.buildShip({ ...baseShip, level: 2 });
    expect(ship).not.toBeNull();
    expect(sys.upgradeShip(ship!.instanceId)).toBe(false);
    expect(sys.ships[0].level).toBe(2);
  });

  it('removes a ship instance', () => {
    const sys = new ShipyardSystem(2);
    const ship = sys.buildShip(baseShip)!;
    expect(sys.removeShip(ship.instanceId)).toBe(true);
    expect(sys.ships.length).toBe(0);
  });
});
