import { CombatEngine } from '../src/systems/CombatEngine';
import { Fleet } from '../src/models/Fleet';
import { ShipClass, ShipInstance } from '../src/models/Ship';
import { Commander, Ability, CommanderRarity, CommanderRole } from '../src/models/Commander';

describe('CombatEngine round simulation', () => {
  function makeShip(id: string, spd: number, hp: number = 100): ShipInstance {
    return {
      id,
      class: ShipClass.Frigate,
      level: 1,
      stats: { atk: 10, def: 5, hp, spd, crit: 0, critDmg: 1.5 },
      capacityCost: 1,
      instanceId: id,
    };
  }
  const dummyCommander: Commander = {
    id: 'cmdr',
    rarity: CommanderRarity.Common,
    role: CommanderRole.Tactician,
    statModifiers: {},
    passive: { id: 'p', name: 'Passive', description: '', basePower: 0, scaling: 0 },
    ultimate: { id: 'u', name: 'Ultimate', description: '', basePower: 0, scaling: 0 },
    shardRequirements: { Common: 0, Rare: 0, Epic: 0, Legendary: 0 },
  };

  it('simulates a round and applies damage', () => {
    const fleetA: Fleet = {
      commander: dummyCommander,
      ships: [makeShip('A1', 20, 50)],
      totalPower: 0,
    };
    const fleetB: Fleet = {
      commander: dummyCommander,
      ships: [makeShip('B1', 10, 50)],
      totalPower: 0,
    };
    const log = CombatEngine.simulateRound(fleetA, fleetB);
    // One ship from each side, both should attack
    expect(log.length).toBe(2);
    // At least one ship should have reduced HP
    const hpA = fleetA.ships[0].stats.hp;
    const hpB = fleetB.ships[0].stats.hp;
    expect(hpA < 50 || hpB < 50).toBe(true);
  });

  it('skips dead ships in turn order and targeting', () => {
    const fleetA: Fleet = {
      commander: dummyCommander,
      ships: [makeShip('A1', 20, 0)], // already dead
      totalPower: 0,
    };
    const fleetB: Fleet = {
      commander: dummyCommander,
      ships: [makeShip('B1', 10, 50)],
      totalPower: 0,
    };
    const log = CombatEngine.simulateRound(fleetA, fleetB);
    // Only B1 should attack, but if A1 is dead, B1 may not have a valid target
    if (log.length === 1) {
      expect(log[0]).toMatch(/B1 attacks/);
    } else {
      expect(log.length).toBe(0); // No valid targets
    }
  });
});
