import { ResourceSystem } from '../src/systems/ResourceSystem';
import { ResourceType } from '../src/models/Resource';
import { Building, BuildingType } from '../src/models/Building';

describe('ResourceSystem', () => {
  const buildings: Building[] = [
    {
      id: 'b1',
      type: BuildingType.Generator,
      level: 1,
      resourceGeneration: { [ResourceType.Energy]: 10 },
      unlocks: [],
    },
    {
      id: 'b2',
      type: BuildingType.Generator,
      level: 2,
      resourceGeneration: { [ResourceType.Alloy]: 5 },
      unlocks: [],
    },
  ];

  it('generates resources per minute based on buildings', () => {
    const rs = new ResourceSystem({}, buildings);
    rs.update(1); // 1 minute
    expect(rs.resources[ResourceType.Energy].amount).toBe(10);
    expect(rs.resources[ResourceType.Alloy].amount).toBe(5);
  });

  it('respects storage caps', () => {
    const rs = new ResourceSystem({
      [ResourceType.Energy]: { type: ResourceType.Energy, amount: 995, storageCap: 1000 },
    }, buildings);
    rs.update(1); // +10 energy, should cap at 1000
    expect(rs.resources[ResourceType.Energy].amount).toBe(1000);
  });

  it('spend and add resources', () => {
    const rs = new ResourceSystem({}, buildings);
    rs.add(ResourceType.Credits, 50);
    expect(rs.resources[ResourceType.Credits].amount).toBe(50);
    expect(rs.spend(ResourceType.Credits, 30)).toBe(true);
    expect(rs.resources[ResourceType.Credits].amount).toBe(20);
    expect(rs.spend(ResourceType.Credits, 25)).toBe(false);
  });

  it('can set storage cap and clamp amount', () => {
    const rs = new ResourceSystem({
      [ResourceType.Data]: { type: ResourceType.Data, amount: 200, storageCap: 200 },
    }, buildings);
    rs.setStorageCap(ResourceType.Data, 100);
    expect(rs.resources[ResourceType.Data].storageCap).toBe(100);
    expect(rs.resources[ResourceType.Data].amount).toBe(100);
  });
});
