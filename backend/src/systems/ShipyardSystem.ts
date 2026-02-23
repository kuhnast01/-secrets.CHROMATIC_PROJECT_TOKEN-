import { Ship, ShipClass, ShipInstance } from '../models/Ship';

/**
 * ShipyardSystem: Handles ship creation, upgrades, and fleet management.
 * - Builds new ships if requirements are met.
 * - Upgrades ships based on shipyard level.
 * - Tracks all player ships (instances).
 */
export class ShipyardSystem {
  ships: ShipInstance[];
  shipyardLevel: number;
  nextInstanceId: number;

  constructor(shipyardLevel: number = 1, initial: ShipInstance[] = []) {
    this.ships = initial;
    this.shipyardLevel = shipyardLevel;
    this.nextInstanceId = initial.length ? Math.max(...initial.map(s => parseInt(s.instanceId.replace('ship_', '')))) + 1 : 1;
  }

  /**
   * Build a new ship if allowed by shipyard level.
   */
  buildShip(base: Ship): ShipInstance | null {
    if (base.level > this.shipyardLevel) return null;
    const instance: ShipInstance = {
      ...base,
      instanceId: `ship_${this.nextInstanceId++}`,
    };
    this.ships.push(instance);
    return instance;
  }

  /**
   * Upgrade a ship instance (if allowed by shipyard level).
   */
  upgradeShip(instanceId: string): boolean {
    const ship = this.ships.find(s => s.instanceId === instanceId);
    if (!ship) return false;
    if (ship.level >= this.shipyardLevel) return false;
    ship.level += 1;
    // Optionally scale stats here
    return true;
  }

  /**
   * Get all ships of a given class.
   */
  getShipsByClass(cls: ShipClass): ShipInstance[] {
    return this.ships.filter(s => s.class === cls);
  }

  /**
   * Remove a ship instance (e.g., scrapping).
   */
  removeShip(instanceId: string): boolean {
    const idx = this.ships.findIndex(s => s.instanceId === instanceId);
    if (idx === -1) return false;
    this.ships.splice(idx, 1);
    return true;
  }
}
