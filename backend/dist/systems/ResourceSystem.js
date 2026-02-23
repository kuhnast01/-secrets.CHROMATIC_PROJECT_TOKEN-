"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceSystem = void 0;
const Resource_1 = require("../models/Resource");
/**
 * ResourceSystem: Handles resource generation, storage, and updates.
 * - Generates resources per minute based on buildings.
 * - Applies tech and building modifiers.
 * - Enforces storage caps.
 */
class ResourceSystem {
    constructor(initial, buildings) {
        this.resources = {
            [Resource_1.ResourceType.Energy]: { type: Resource_1.ResourceType.Energy, amount: 0, storageCap: 1000 },
            [Resource_1.ResourceType.Alloy]: { type: Resource_1.ResourceType.Alloy, amount: 0, storageCap: 1000 },
            [Resource_1.ResourceType.Credits]: { type: Resource_1.ResourceType.Credits, amount: 0, storageCap: 1000 },
            [Resource_1.ResourceType.Data]: { type: Resource_1.ResourceType.Data, amount: 0, storageCap: 1000 },
            ...initial,
        };
        this.buildings = buildings;
    }
    /**
     * Calculate total generation per minute for each resource.
     */
    getGenerationPerMinute() {
        const gen = {};
        for (const b of this.buildings) {
            for (const [rtype, amount] of Object.entries(b.resourceGeneration)) {
                const type = rtype;
                gen[type] = (gen[type] || 0) + (amount || 0);
            }
        }
        return gen;
    }
    /**
     * Update resources by elapsed minutes, applying generation and storage caps.
     */
    update(minutes) {
        const gen = this.getGenerationPerMinute();
        for (const type of Object.values(Resource_1.ResourceType)) {
            const r = this.resources[type];
            const add = (gen[type] || 0) * minutes;
            r.amount = Math.min(r.amount + add, r.storageCap);
        }
    }
    /**
     * Spend a resource, returns true if successful.
     */
    spend(type, amount) {
        const r = this.resources[type];
        if (r.amount < amount)
            return false;
        r.amount -= amount;
        return true;
    }
    /**
     * Add to a resource, respecting storage cap.
     */
    add(type, amount) {
        const r = this.resources[type];
        r.amount = Math.min(r.amount + amount, r.storageCap);
    }
    /**
     * Set storage cap for a resource.
     */
    setStorageCap(type, cap) {
        this.resources[type].storageCap = cap;
        if (this.resources[type].amount > cap) {
            this.resources[type].amount = cap;
        }
    }
}
exports.ResourceSystem = ResourceSystem;
