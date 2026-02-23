import { Resource, ResourceType } from '../models/Resource';
import { Building } from '../models/Building';

/**
 * ResourceSystem: Handles resource generation, storage, and updates.
 * - Generates resources per minute based on buildings.
 * - Applies tech and building modifiers.
 * - Enforces storage caps.
 */
export class ResourceSystem {
  resources: Record<ResourceType, Resource>;
  buildings: Building[];

  constructor(initial: Partial<Record<ResourceType, Resource>>, buildings: Building[]) {
    this.resources = {
      [ResourceType.Energy]: { type: ResourceType.Energy, amount: 0, storageCap: 1000 },
      [ResourceType.Alloy]: { type: ResourceType.Alloy, amount: 0, storageCap: 1000 },
      [ResourceType.Credits]: { type: ResourceType.Credits, amount: 0, storageCap: 1000 },
      [ResourceType.Data]: { type: ResourceType.Data, amount: 0, storageCap: 1000 },
      ...initial,
    };
    this.buildings = buildings;
  }

  /**
   * Calculate total generation per minute for each resource.
   */
  getGenerationPerMinute(): Partial<Record<ResourceType, number>> {
    const gen: Partial<Record<ResourceType, number>> = {};
    for (const b of this.buildings) {
      for (const [rtype, amount] of Object.entries(b.resourceGeneration)) {
        const type = rtype as ResourceType;
        gen[type] = (gen[type] || 0) + (amount || 0);
      }
    }
    return gen;
  }

  /**
   * Update resources by elapsed minutes, applying generation and storage caps.
   */
  update(minutes: number) {
    const gen = this.getGenerationPerMinute();
    for (const type of Object.values(ResourceType)) {
      const r = this.resources[type];
      const add = (gen[type] || 0) * minutes;
      r.amount = Math.min(r.amount + add, r.storageCap);
    }
  }

  /**
   * Spend a resource, returns true if successful.
   */
  spend(type: ResourceType, amount: number): boolean {
    const r = this.resources[type];
    if (r.amount < amount) return false;
    r.amount -= amount;
    return true;
  }

  /**
   * Add to a resource, respecting storage cap.
   */
  add(type: ResourceType, amount: number) {
    const r = this.resources[type];
    r.amount = Math.min(r.amount + amount, r.storageCap);
  }

  /**
   * Set storage cap for a resource.
   */
  setStorageCap(type: ResourceType, cap: number) {
    this.resources[type].storageCap = cap;
    if (this.resources[type].amount > cap) {
      this.resources[type].amount = cap;
    }
  }
}
