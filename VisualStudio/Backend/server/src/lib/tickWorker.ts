import { getAllPlayers, savePlayer } from './inMemoryStore';
import { accrueResourcesToPlayer, applyCompletedBuildingUpgrades, applyCompletedResearch } from './economy';
import { logEvent } from './analytics';

let intervalId: NodeJS.Timeout | null = null;
let metrics = {
  ticksRun: 0,
  playersProcessed: 0,
  errors: 0,
  lastRunTs: 0
};

async function runOnceImpl(now = Date.now()) {
  const players = await getAllPlayers();
  let processed = 0;
  for (const p of players) {
    try {
      // process any completed building upgrades and research BEFORE accrual
      const upgrades = applyCompletedBuildingUpgrades(p, now);
      const research = applyCompletedResearch(p, now);
      if (upgrades.length) logEvent('tick.building_upgrades_applied', { playerId: p.id, upgrades });
      if (research.length) logEvent('tick.research_completed', { playerId: p.id, research });

      const { produced } = accrueResourcesToPlayer(p, now);
      await savePlayer(p.id || 'player-1', p);
      processed += 1;
      logEvent('tick.player_accrued', { playerId: p.id, produced });
    } catch (err) {
      metrics.errors += 1;
      const emsg = (err as any)?.message || String(err);
      logEvent('tick.player_error', { playerId: p.id, err: emsg });
    }
  }
  metrics.ticksRun += 1;
  metrics.playersProcessed += processed;
  metrics.lastRunTs = now;
  logEvent('tick.run', { ticksRun: metrics.ticksRun, playersProcessed: processed, ts: now });
  return { processed };
}

/**
 * Start a periodic tick which accrues production for all players and persists them.
 * intervalMs - tick frequency in milliseconds (default 10_000)
 */
export function startTick(intervalMs = Number(process.env.ECON_TICK_INTERVAL_MS) || 10000) {
  if (intervalId) return; // already running
  intervalId = setInterval(async () => {
    try {
      await runOnceImpl(Date.now());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('tick: unexpected error', err);
      metrics.errors += 1;
      const emsg = (err as any)?.message || String(err);
      logEvent('tick.error', { err: emsg });
    }
  }, intervalMs);
}

export function stopTick() {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
}

export async function runOnce(now = Date.now()) {
  return runOnceImpl(now);
}

export function getMetrics() {
  return { ...metrics };
}
