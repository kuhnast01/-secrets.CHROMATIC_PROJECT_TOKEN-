import { CombatEngine } from '../src/systems/CombatEngine';
import { Fleet } from '../src/models/Fleet';
import { ShipClass, ShipInstance } from '../src/models/Ship';
import { Commander, Ability, CommanderRarity, CommanderRole } from '../src/models/Commander';

describe('CombatEngine battle simulation', () => {
  function makeShip(id: string, spd: number, hp: number = 50): ShipInstance {
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

  it('simulates a full battle and declares a winner', () => {
    const fleetA: Fleet = {
      commander: dummyCommander,
      ships: [makeShip('A1', 20, 30)],
      totalPower: 0,
    };
    const fleetB: Fleet = {
      commander: dummyCommander,
      ships: [makeShip('B1', 10, 30)],
      totalPower: 0,
    };
    const { result, log } = CombatEngine.simulateBattle(fleetA, fleetB);
    expect(['attacker', 'defender', 'draw']).toContain(result);
    expect(log.some(l => /wins|Draw/.test(l))).toBe(true);
  });

  it('ends in timeout if round limit reached', () => {
    // Give both ships extremely high HP so neither can be killed in a single round
    const fleetA: Fleet = {
      commander: dummyCommander,
      ships: [makeShip('A1', 20, 100000)],
      totalPower: 0,
    };
    const fleetB: Fleet = {
      commander: dummyCommander,
      ships: [makeShip('B1', 10, 100000)],
      totalPower: 0,
    };
    // Set maxRounds to 1 so neither can kill the other
    const { result, log } = CombatEngine.simulateBattle(fleetA, fleetB, 1);
    expect(result).toBe('timeout');
    expect(log[log.length - 1]).toMatch(/round limit/);
  });
});
