"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipyardSystem = void 0;
/**
 * ShipyardSystem: Handles ship creation, upgrades, and fleet management.
 * - Builds new ships if requirements are met.
 * - Upgrades ships based on shipyard level.
 * - Tracks all player ships (instances).
 */
class ShipyardSystem {
    constructor(shipyardLevel = 1, initial = []) {
        this.ships = initial;
        this.shipyardLevel = shipyardLevel;
        this.nextInstanceId = initial.length ? Math.max(...initial.map(s => parseInt(s.instanceId.replace('ship_', '')))) + 1 : 1;
    }
    /**
     * Build a new ship if allowed by shipyard level.
     */
    buildShip(base) {
        if (base.level > this.shipyardLevel)
            return null;
        const instance = {
            ...base,
            instanceId: `ship_${this.nextInstanceId++}`,
        };
        this.ships.push(instance);
        return instance;
    }
    /**
     * Upgrade a ship instance (if allowed by shipyard level).
     */
    upgradeShip(instanceId) {
        const ship = this.ships.find(s => s.instanceId === instanceId);
        if (!ship)
            return false;
        if (ship.level >= this.shipyardLevel)
            return false;
        ship.level += 1;
        // Optionally scale stats here
        return true;
    }
    /**
     * Get all ships of a given class.
     */
    getShipsByClass(cls) {
        return this.ships.filter(s => s.class === cls);
    }
    /**
     * Remove a ship instance (e.g., scrapping).
     */
    removeShip(instanceId) {
        const idx = this.ships.findIndex(s => s.instanceId === instanceId);
        if (idx === -1)
            return false;
        this.ships.splice(idx, 1);
        return true;
    }
}
exports.ShipyardSystem = ShipyardSystem;
