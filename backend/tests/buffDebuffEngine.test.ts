import { BuffDebuffEngine, Buff, Debuff } from '../src/systems/BuffDebuffEngine';

describe('BuffDebuffEngine', () => {
  it('applies and stacks buffs up to max', () => {
    const engine = new BuffDebuffEngine();
    const buff: Buff = { type: 'attack', value: 5, duration: 2, stacks: 1, maxStacks: 5 };
    engine.addBuff(buff);
    engine.addBuff({ ...buff, stacks: 3 });
    expect(engine.getBuffValue('attack')).toBe(20); // 4 stacks * value 5
    engine.addBuff({ ...buff, stacks: 3 });
    expect(engine.getBuffValue('attack')).toBe(25); // 5 stacks * value 5 (max)
  });

  it('applies and stacks debuffs up to max', () => {
    const engine = new BuffDebuffEngine();
    const debuff: Debuff = { type: 'dot', value: 2, duration: 2, stacks: 1, maxStacks: 3 };
    engine.addDebuff(debuff);
    engine.addDebuff({ ...debuff, stacks: 2 });
    expect(engine.debuffs[0].stacks).toBe(3);
  });

  it('expires buffs and debuffs after duration', () => {
    const engine = new BuffDebuffEngine();
    const buff: Buff = { type: 'attack', value: 5, duration: 1, stacks: 1, maxStacks: 5 };
    engine.addBuff(buff);
    engine.tick();
    expect(engine.buffs.length).toBe(0);
    const debuff: Debuff = { type: 'dot', value: 2, duration: 1, stacks: 1, maxStacks: 3 };
    engine.addDebuff(debuff);
    engine.tick();
    expect(engine.debuffs.length).toBe(0);
  });

  it('sums buff and debuff values by type', () => {
    const engine = new BuffDebuffEngine();
    engine.addBuff({ type: 'attack', value: 2, duration: 2, stacks: 2, maxStacks: 5 });
    engine.addBuff({ type: 'attack', value: 1, duration: 2, stacks: 1, maxStacks: 5 });
    expect(engine.getBuffValue('attack')).toBe(5);
    engine.addDebuff({ type: 'dot', value: 3, duration: 2, stacks: 2, maxStacks: 3 });
    expect(engine.getDebuffValue('dot')).toBe(6);
  });
});
