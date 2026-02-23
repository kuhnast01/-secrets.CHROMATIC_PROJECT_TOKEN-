import { describe, it, expect } from 'vitest';
import Building from '../src/models/Building';
import Commander from '../src/models/Commander';
import Resource from '../src/models/Resource';
import Ship from '../src/models/Ship';
import Mission from '../src/models/Mission';

// MVP Data Models & Content Tables

describe('MVP Data Models', () => {
  it('should instantiate Building model', () => {
    const building = new Building({ name: 'Mine', level: 1 });
    expect(building).toBeDefined();
    expect(building.name).toBe('Mine');
  });

  it('should instantiate Commander model', () => {
    const commander = new Commander({ name: 'Ace', rarity: 'Rare' });
    expect(commander).toBeDefined();
    expect(commander.rarity).toBe('Rare');
  });

  it('should instantiate Resource model', () => {
    const resource = new Resource({ type: 'Gold', amount: 100 });
    expect(resource).toBeDefined();
    expect(resource.amount).toBe(100);
  });

  it('should instantiate Ship model', () => {
    const ship = new Ship({ class: 'Frigate', cost: 500 });
    expect(ship).toBeDefined();
    expect(ship.class).toBe('Frigate');
  });

  it('should instantiate Mission model', () => {
    const mission = new Mission({ name: 'Explore Sector', reward: 'XP' });
    expect(mission).toBeDefined();
    expect(mission.reward).toBe('XP');
  });
});
