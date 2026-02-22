
import { Fleet } from '../models/Fleet';
import { ShipInstance, ShipClass } from '../models/Ship';
import { Commander } from '../models/Commander';

/**
 * CombatEngine: Handles battle resolution between two fleets.
 * Implements all core combat formulas and round flow.
 */
export class CombatEngine {
  /**
   * Simulate a full battle between two fleets. Returns log and result.
   */
  static simulateBattle(attackerFleet: Fleet, defenderFleet: Fleet, maxRounds: number = 20) {
    const log: string[] = [];
    let round = 1;
    while (round <= maxRounds) {
      log.push(`-- Round ${round} --`);
      log.push(...this.simulateRound(attackerFleet, defenderFleet));
      // Check for win/loss
      const attackerAlive = attackerFleet.ships.some(s => s.stats.hp > 0);
      const defenderAlive = defenderFleet.ships.some(s => s.stats.hp > 0);
      if (!attackerAlive && !defenderAlive) {
        log.push('Draw: both fleets destroyed.');
        return { result: 'draw', log };
      }
      if (!attackerAlive) {
        log.push('Defender wins!');
        return { result: 'defender', log };
      }
      if (!defenderAlive) {
        log.push('Attacker wins!');
        return { result: 'attacker', log };
      }
      round++;
    }
    log.push('Battle ended: round limit reached.');
    return { result: 'timeout', log };
  }
  static calcEffectiveHP(hp: number, def: number): number {
    return hp * (1 + def / 100);
  }

  static calcEffectiveDamage(atk: number, crit: number, critDmg: number): number {
    return atk * (1 + crit * (critDmg - 1));
  }

  static calcBaseDamage(atk: number, def: number): number {
    return atk * (100 / (100 + def));
  }

  static calcCritDamage(dmg: number, critDmg: number): number {
    return dmg * critDmg;
  }

  static calcAbilityDamage(base: number, ap: number): number {
    return base * (1 + ap);
  }

  static minDamageRule(atk: number, dmg: number): number {
    return Math.max(dmg, atk * 0.05);
  }

  static calcShipPower(ship: ShipInstance): number {
    const s = ship.stats;
    return s.atk + s.def + (s.hp / 10) + (s.spd * 2);
  }

  static calcCommanderPower(commander: Commander, baseStats: number, abilityPower: number, rarityMultiplier: number): number {
    return (baseStats * rarityMultiplier) + abilityPower;
  }

  static calcFleetPower(fleet: Fleet, rarityMultiplier: number = 1, abilityPower: number = 0): number {
    const shipPower = fleet.ships.reduce((sum, s) => sum + this.calcShipPower(s), 0);
    const commanderPower = this.calcCommanderPower(fleet.commander, shipPower, abilityPower, rarityMultiplier);
    return shipPower + commanderPower;
  }

  /**
   * Determine turn order for a list of ships (descending SPD, then by class rarity, then random).
   */
  static determineTurnOrder(ships: ShipInstance[]): ShipInstance[] {
    // For MVP, use SPD only. Extend with class/rarity if needed.
    return [...ships].sort((a, b) => b.stats.spd - a.stats.spd);
  }

  /**
   * Simulate a single round of combat between two fleets.
   * Returns a log of actions and updated ship states.
   */
  static simulateRound(attackerFleet: Fleet, defenderFleet: Fleet) {
    const log: string[] = [];
    // --- Buff/Debuff Integration ---
    // Attach a BuffDebuffEngine to each fleet if not present
    if (!(attackerFleet as any)._buffEngine) (attackerFleet as any)._buffEngine = new (require('./BuffDebuffEngine').BuffDebuffEngine)();
    if (!(defenderFleet as any)._buffEngine) (defenderFleet as any)._buffEngine = new (require('./BuffDebuffEngine').BuffDebuffEngine)();
    const attackerBuffs = (attackerFleet as any)._buffEngine;
    const defenderBuffs = (defenderFleet as any)._buffEngine;

    // Tick buffs/debuffs at the start of the round
    attackerBuffs.tick();
    defenderBuffs.tick();

    // Apply commander passive abilities as stat modifiers at the start of the round
    function applyCommanderPassive(fleet: Fleet, label: string) {
      const passive = fleet.commander.passive;
      if (passive && passive.basePower > 0) {
        for (const ship of fleet.ships) {
          ship.stats.atk += passive.basePower;
        }
        log.push(`${label} commander passive '${passive.name}' activated: +${passive.basePower} ATK to all ships.`);
      }
    }
    applyCommanderPassive(attackerFleet, 'Attacker');
    applyCommanderPassive(defenderFleet, 'Defender');

    // TODO: Apply advanced status effects (stun, silence, dot, hot, shield, etc.)
    // For now, just log active buffs/debuffs
    function logBuffs(fleet: Fleet, label: string, buffs: any) {
      if (buffs.buffs.length > 0) log.push(`${label} buffs: ` + buffs.buffs.map((b: any) => `${b.type} x${b.stacks}`).join(', '));
      if (buffs.debuffs.length > 0) log.push(`${label} debuffs: ` + buffs.debuffs.map((d: any) => `${d.type} x${d.stacks}`).join(', '));
    }
    logBuffs(attackerFleet, 'Attacker', attackerBuffs);
    logBuffs(defenderFleet, 'Defender', defenderBuffs);

    // Combine all ships for turn order
    const allShips = [...attackerFleet.ships, ...defenderFleet.ships];
    const turnOrder = this.determineTurnOrder(allShips);

    for (const ship of turnOrder) {
      if (ship.stats.hp <= 0) continue; // Skip dead ships
      // Determine target: MVP = random enemy ship
      const isAttacker = attackerFleet.ships.includes(ship);
      const enemyFleet = isAttacker ? defenderFleet : attackerFleet;
      const targets = enemyFleet.ships.filter(s => s.stats.hp > 0);
      if (targets.length === 0) continue;
      const target = targets[Math.floor(Math.random() * targets.length)];

      // TODO: Check for stun/silence debuffs before acting
      // TODO: Apply DoT/HoT/shield effects here

      // Calculate damage (MVP: base damage, no crit/abilities yet)
      const dmg = this.minDamageRule(ship.stats.atk, this.calcBaseDamage(ship.stats.atk, target.stats.def));
      target.stats.hp = Math.max(0, target.stats.hp - dmg);
      log.push(`${ship.id} attacks ${target.id} for ${Math.round(dmg)} damage.`);
    }
    return log;
  }
}
