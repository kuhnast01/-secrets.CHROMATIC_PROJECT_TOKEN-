import { BuildingSystem } from '../src/systems/BuildingSystem';
import { BuildingType } from '../src/models/Building';
import { ResourceType } from '../src/models/Resource';

describe('BuildingSystem', () => {
  it('adds a new building and prevents duplicates', () => {
    const bs = new BuildingSystem();
    expect(bs.addBuilding(BuildingType.Generator, 'gen1')).toBe(true);
    expect(bs.addBuilding(BuildingType.Generator, 'gen2')).toBe(false);
    expect(bs.buildings.length).toBe(1);
  });

  it('upgrades a building and increases generation', () => {
    const bs = new BuildingSystem();
    bs.addBuilding(BuildingType.Generator, 'gen1');
    const before = bs.buildings[0].resourceGeneration[ResourceType.Energy] ?? 0;
    expect(bs.upgradeBuilding(BuildingType.Generator)).toBe(true);
    const after = bs.buildings[0].resourceGeneration[ResourceType.Energy] ?? 0;
    expect(after).toBeGreaterThan(before);
  });

  it('returns all unlocks', () => {
    const bs = new BuildingSystem();
    bs.addBuilding(BuildingType.Generator, 'gen1', ['Shipyard']);
    bs.addBuilding(BuildingType.Storage, 'stor1', ['ResearchLab']);
    expect(bs.getUnlocks()).toEqual(['Shipyard', 'ResearchLab']);
  });

  it('calculates total resource generation', () => {
    const bs = new BuildingSystem();
    bs.addBuilding(BuildingType.Generator, 'gen1');
    bs.addBuilding(BuildingType.Storage, 'stor1');
    const gen = bs.getTotalGeneration();
    expect(gen[ResourceType.Energy]).toBeGreaterThan(0);
    expect(gen[ResourceType.Credits]).toBeGreaterThan(0);
  });
});
