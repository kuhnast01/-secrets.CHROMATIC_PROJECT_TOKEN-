import { Router } from 'express';
import { getPlayer, savePlayer } from '../lib/inMemoryStore';

const router = Router();

import { BUILDING_DEFS, calcProduction, accrueResourcesToPlayer } from '../lib/economy';


// GET /api/economy/resources -> returns current resources including production since lastCollectedAt (not persisted)
router.get('/resources', async (_req, res) => {
  const player = (await getPlayer('player-1')) || { resources: { energy: 0, alloy: 0, credits: 0, data: 0 }, buildings: {}, lastCollectedAt: Date.now() };
  const now = Date.now();
  const { produced } = calcProduction(player, now);
  const current = {
    energy: Math.min((player.resources.energy || 0) + produced.energy, 5000),
    alloy: Math.min((player.resources.alloy || 0) + produced.alloy, 2000),
    credits: Math.min((player.resources.credits || 0) + produced.credits, 20000),
    data: Math.min((player.resources.data || 0) + produced.data, 1000)
  };
  res.json({ resources: current, produced });
});

// POST /api/economy/collect -> collect produced resources and persist lastCollectedAt
router.post('/collect', async (_req, res) => {
  const player = (await getPlayer('player-1')) || { resources: { energy: 0, alloy: 0, credits: 0, data: 0 }, buildings: {}, lastCollectedAt: Date.now() };
  const now = Date.now();
  const { produced } = calcProduction(player, now);
  player.resources = player.resources || { energy: 0, alloy: 0, credits: 0, data: 0 };
  player.resources.energy = Math.min((player.resources.energy || 0) + produced.energy, 5000);
  player.resources.alloy = Math.min((player.resources.alloy || 0) + produced.alloy, 2000);
  player.resources.credits = Math.min((player.resources.credits || 0) + produced.credits, 20000);
  player.resources.data = Math.min((player.resources.data || 0) + produced.data, 1000);
  player.lastCollectedAt = now;
  await savePlayer(player.id || 'player-1', player);
  res.json({ player });
});

// GET /api/economy/buildings -> return building states
router.get('/buildings', async (_req, res) => {
  const player = (await getPlayer('player-1')) || { buildings: {} };
  player.buildings = player.buildings || {};
  // ensure defaults
  for (const name of Object.keys(BUILDING_DEFS)) {
    player.buildings[name] = player.buildings[name] || { level: 1 };
  }
  res.json({ buildings: player.buildings, defs: BUILDING_DEFS });
});

// POST /api/economy/buildings/upgrade -> start upgrade (deduct credits and set timer)
router.post('/buildings/upgrade', async (req, res) => {
  const { building = 'Energy Reactor' } = req.body;
  const player = (await getPlayer('player-1')) || { resources: { credits: 0 }, buildings: {} };
  player.buildings = player.buildings || {};
  const def = BUILDING_DEFS[building];
  if (!def) return res.status(400).json({ error: 'unknown building' });
  const level = (player.buildings[building]?.level) || 1;
  const cost = (def.upgradeCost?.credits || 0) * (level + 1);
  const credits = (player.resources?.credits) || 0;
  if (credits < cost) return res.status(400).json({ error: 'not enough credits', required: cost, available: credits });
  player.resources.credits = credits - cost;
  const duration = def.upgradeTimeSec * (level + 1);
  player.buildings[building] = { ...(player.buildings[building] || {}), level, upgradeCompleteAt: Date.now() + duration * 1000 };
  await savePlayer(player.id || 'player-1', player);
  res.json({ building, upgradeCompleteAt: player.buildings[building].upgradeCompleteAt });
});

export default router;
