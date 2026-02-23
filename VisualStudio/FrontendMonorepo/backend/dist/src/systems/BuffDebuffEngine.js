/**
 * BuffDebuffEngine: Handles application, stacking, and expiration of buffs/debuffs.
 */
export class BuffDebuffEngine {
    constructor() {
        this.buffs = [];
        this.debuffs = [];
    }
    addBuff(buff) {
        const existing = this.buffs.find(b => b.type === buff.type);
        if (existing) {
            const newStacks = Math.min(existing.stacks + buff.stacks, buff.maxStacks);
            // If value is different, adjust total value proportionally
            if (existing.value !== buff.value) {
                // Calculate the number of new stacks being added
                const stacksAdded = newStacks - existing.stacks;
                // Weighted average for value: (oldValue*oldStacks + newValue*newStacks) / totalStacks
                existing.value = ((existing.value * existing.stacks) + (buff.value * stacksAdded)) / newStacks;
            }
            else {
                existing.value = buff.value; // Use latest value if same
            }
            existing.stacks = newStacks;
            existing.duration = Math.max(existing.duration, buff.duration);
        }
        else {
            this.buffs.push({ ...buff });
        }
    }
    addDebuff(debuff) {
        const existing = this.debuffs.find(d => d.type === debuff.type);
        if (existing) {
            existing.stacks = Math.min(existing.stacks + debuff.stacks, debuff.maxStacks);
            existing.duration = Math.max(existing.duration, debuff.duration);
            existing.value = debuff.value; // Always use latest value
        }
        else {
            this.debuffs.push({ ...debuff });
        }
    }
    tick() {
        this.buffs.forEach(b => b.duration--);
        this.debuffs.forEach(d => d.duration--);
        this.buffs = this.buffs.filter(b => b.duration > 0 && b.stacks > 0);
        this.debuffs = this.debuffs.filter(d => d.duration > 0 && d.stacks > 0);
    }
    getBuffValue(type) {
        return this.buffs.filter(b => b.type === type).reduce((sum, b) => sum + b.value * b.stacks, 0);
    }
    getDebuffValue(type) {
        return this.debuffs.filter(d => d.type === type).reduce((sum, d) => sum + d.value * d.stacks, 0);
    }
}
