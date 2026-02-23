import { BuildingType } from '../models/Building';
import { ResourceType } from '../models/Resource';
/**
 * BuildingSystem: Handles building construction, upgrades, and unlock logic.
 * - Tracks all player buildings and their levels.
 * - Calculates resource generation and unlocks.
 * - Enforces build/upgrade requirements.
 */
export class BuildingSystem {
    constructor(initial = []) {
        this.buildings = initial;
    }
    /**
     * Add a new building if requirements are met.
     */
    addBuilding(type, id, unlocks = []) {
        if (this.buildings.find(b => b.type === type))
            return false; // Only one per type for MVP
        this.buildings.push({
            id,
            type,
            level: 1,
            resourceGeneration: this.getBaseGeneration(type, 1),
            unlocks,
        });
        return true;
    }
    /**
     * Upgrade a building, increasing its level and resource generation.
     */
    upgradeBuilding(type) {
        const b = this.buildings.find(b => b.type === type);
        if (!b)
            return false;
        b.level += 1;
        b.resourceGeneration = this.getBaseGeneration(type, b.level);
        return true;
    }
    /**
     * Get base resource generation for a building type and level.
     * (Exponential scaling: 1.25x per level for buildings)
     */
    getBaseGeneration(type, level) {
        switch (type) {
            case BuildingType.Generator:
                return { [ResourceType.Energy]: Math.round(10 * Math.pow(1.25, level - 1)) };
            case BuildingType.Shipyard:
                return { [ResourceType.Alloy]: Math.round(5 * Math.pow(1.25, level - 1)) };
            case BuildingType.ResearchLab:
                return { [ResourceType.Data]: Math.round(2 * Math.pow(1.25, level - 1)) };
            case BuildingType.Storage:
                return { [ResourceType.Credits]: Math.round(8 * Math.pow(1.25, level - 1)) };
            default:
                return {};
        }
    }
    /**
     * Get all unlocks from current buildings.
     */
    getUnlocks() {
        return this.buildings.flatMap(b => b.unlocks);
    }
    /**
     * Get total resource generation per minute from all buildings.
     */
    getTotalGeneration() {
        const gen = {};
        for (const b of this.buildings) {
            for (const [rtype, amount] of Object.entries(b.resourceGeneration)) {
                const type = rtype;
                gen[type] = (gen[type] || 0) + (amount || 0);
            }
        }
        return gen;
    }
}
