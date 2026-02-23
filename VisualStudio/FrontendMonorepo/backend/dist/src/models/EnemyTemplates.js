/**
 * ENEMY_TEMPLATES: All enemy templates for Sectors 1-10.
 *
 * Usage:
 *   import { ENEMY_TEMPLATES, getEnemyTemplateById } from './EnemyTemplates';
 *
 *   // Get all templates:
 *   const allTemplates = ENEMY_TEMPLATES;
 *
 *   // Lookup by id:
 *   const template = getEnemyTemplateById('ENM_101');
 *   if (template) {
 *     // use template
 *   }
 *
 *   // For DB seeding, iterate ENEMY_TEMPLATES and insert as needed.
 *
 * Data structure matches EnemyTemplate interface for type safety and integration.
 */
// AUTO-GENERATED: Enemy Templates Table 8 (Faction Based)
// This file contains all enemy templates for Sectors 1-10, structured for direct use in DB seeding or static data loading.
// Generated from TABLE 8 — ENEMY TEMPLATES (FACTION BASED)
import { ShipClass } from './Ship';
export const ENEMY_TEMPLATES = [
    // ⭐ SECTOR 1 — PIRATE CLANS
    {
        id: 'ENM_101',
        faction: 'Pirate Clans',
        ships: [
            { id: 'Fighter', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
        ],
        modifiers: { attack: 0.10, defense: -0.10 },
        anomaly: {},
        bossAbility: null,
    },
    {
        id: 'ENM_102',
        faction: 'Pirate Clans',
        ships: [
            { id: 'Fighter', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Frigate', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Cruiser', class: ShipClass.Cruiser, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Fighter', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Frigate', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
        ],
        modifiers: { attack: 0.10 },
        anomaly: {},
        bossAbility: null,
    },
    {
        id: 'ENM_103',
        faction: 'Pirate Clans',
        ships: [
            { id: 'Fighter', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Frigate', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Cruiser', class: ShipClass.Cruiser, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Fighter', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Frigate', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
        ],
        modifiers: {},
        anomaly: {},
        bossAbility: null,
    },
    {
        id: 'ENM_104',
        faction: 'Pirate Clans',
        ships: [
            { id: 'Fighter', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
        ],
        modifiers: { attack: 0.15 },
        anomaly: {},
        bossAbility: null,
    },
    {
        id: 'ENM_105',
        faction: 'Pirate Clans',
        ships: [
            { id: 'Fighter', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Frigate', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Cruiser', class: ShipClass.Cruiser, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
        ],
        modifiers: {},
        anomaly: {},
        bossAbility: null,
    },
    {
        id: 'ENM_106',
        faction: 'Pirate Clans',
        ships: [
            { id: 'Fighter', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Frigate', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Cruiser', class: ShipClass.Cruiser, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
        ],
        modifiers: {},
        anomaly: {},
        bossAbility: null,
    },
    {
        id: 'ENM_107',
        faction: 'Pirate Clans',
        ships: [
            { id: 'Fighter', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Frigate', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
        ],
        modifiers: {},
        anomaly: { attack: 0.20, defense: -0.20 },
        bossAbility: null,
    },
    {
        id: 'ENM_108',
        faction: 'Pirate Clans',
        ships: [
            { id: 'Fighter', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Frigate', class: ShipClass.Frigate, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
            { id: 'Cruiser', class: ShipClass.Cruiser, level: 1, stats: { atk: 0, def: 0, hp: 0, spd: 0, crit: 0, critDmg: 0 }, capacityCost: 1, instanceId: "" },
        ],
        modifiers: {},
        anomaly: {},
        bossAbility: {
            id: 'adrenal_surge',
            name: 'Adrenal Surge',
            description: '+30% Attack for 2 rounds',
            basePower: 0.3,
            scaling: 1,
        },
    },
];
/**
 * Lookup an enemy template by its id.
 * @param id The template id (e.g., 'ENM_101')
 * @returns The EnemyTemplate or undefined if not found
 */
export function getEnemyTemplateById(id) {
    return ENEMY_TEMPLATES.find(t => t.id === id);
}
