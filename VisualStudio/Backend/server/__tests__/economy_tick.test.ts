import { startTick, stopTick } from '../src/lib/tickWorker';
import { savePlayer, getPlayer } from '../src/lib/inMemoryStore';

jest.useRealTimers();

describe('economy tick worker', () => {
  afterEach(async () => {
    stopTick();
  });

  test('tick accrues resources for stored players', async () => {
    // set player with lastCollectedAt far in the past so accrual produces measurable amount
    const old = Date.now() - 60_000; // 60s ago
    await savePlayer('player-1', { id: 'player-1', resources: { energy: 0, alloy: 0, credits: 0, data: 0 }, buildings: { 'Energy Reactor': { level: 1 }, 'Credit Vault': { level: 1 } }, lastCollectedAt: old });

    // start tick quickly (100ms) and allow it to run once
    startTick(100);
    await new Promise((r) => setTimeout(r, 220));
    stopTick();

    const p = await getPlayer('player-1');
    expect(p.resources.energy).toBeGreaterThan(0);
    expect(p.resources.credits).toBeGreaterThan(0);
    expect(p.lastCollectedAt).toBeGreaterThan(old);
  });

  test('runOnce applies completed upgrades and research', async () => {
    const now = Date.now();
    const player = {
      id: 'player-1',
      resources: { energy: 0, alloy: 0, credits: 0, data: 0 },
      buildings: { 'Energy Reactor': { level: 1, upgradeCompleteAt: now - 1000 } },
      researchQueue: [{ id: 'r1', endAt: now - 1000, effect: { shipAtkPercent: 0.05 } }],
      lastCollectedAt: now - 10000
    };
    await savePlayer('player-1', player);

    const { runOnce } = require('../src/lib/tickWorker');
    await runOnce(now);

    const p = await getPlayer('player-1');
    expect(p.buildings['Energy Reactor'].level).toBeGreaterThanOrEqual(2);
    expect(p.buildings['Energy Reactor'].upgradeCompleteAt).toBeUndefined();
    expect(p.tech.shipAtkPercent).toBeGreaterThanOrEqual(0.05);
  });
});
