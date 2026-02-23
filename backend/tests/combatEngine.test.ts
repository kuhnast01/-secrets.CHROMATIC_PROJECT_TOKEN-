import { CombatEngine } from '../src/systems/CombatEngine';

describe('CombatEngine formulas', () => {
  it('calculates effective HP', () => {
    expect(CombatEngine.calcEffectiveHP(100, 50)).toBe(150);
  });

  it('calculates effective damage', () => {
    expect(CombatEngine.calcEffectiveDamage(100, 0.2, 2)).toBe(120);
  });

  it('calculates base damage', () => {
    expect(CombatEngine.calcBaseDamage(100, 50)).toBeCloseTo(66.666, 2);
  });

  it('applies crit damage', () => {
    expect(CombatEngine.calcCritDamage(100, 2)).toBe(200);
  });

  it('applies ability power scaling', () => {
    expect(CombatEngine.calcAbilityDamage(100, 0.5)).toBe(150);
  });

  it('applies minimum damage rule', () => {
    expect(CombatEngine.minDamageRule(100, 2)).toBe(5);
    expect(CombatEngine.minDamageRule(100, 10)).toBe(10);
  });
});
