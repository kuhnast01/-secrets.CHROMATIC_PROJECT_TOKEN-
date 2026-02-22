import { Router } from 'express';

const router = Router();

// GET /api/player/profile
router.get('/profile', async (_req, res) => {
  // return stored player if exists, otherwise default profile
  const { getPlayer, savePlayer } = require('../lib/inMemoryStore');
  const player = (await getPlayer('player-1')) || {
    playerId: 'player-1',
    level: 5,
    resources: { energy: 1200, alloy: 540, credits: 12000, data: 320 },
    tech: { shipAtkPercent: 0.0, commanderBonus: 0.0 },
    commanders: [],
    fleets: [],
    researchQueue: []
  };

  // process completed research items on-read
  player.researchQueue = player.researchQueue || [];
  const now = Date.now();
  const completed: any[] = [];
  const remaining: any[] = [];
  for (const q of player.researchQueue) {
    if ((q.endAt || 0) <= now) {
      // apply effect
      player.tech = player.tech || {};
      Object.entries(q.effect || {}).forEach(([k, v]) => { player.tech[k] = (player.tech[k] || 0) + (v as number); });
      completed.push(q);
    } else {
      remaining.push(q);
    }
  }

  // process completed building upgrades
  player.buildings = player.buildings || {};
  for (const [key, b] of Object.entries(player.buildings) as [string, any][]) {
    if (b.upgradeCompleteAt && b.upgradeCompleteAt <= now) {
      b.level = (b.level || 1) + 1;
      delete b.upgradeCompleteAt;
    }
  }

  if (completed.length > 0 || Object.values(player.buildings).some((b:any) => b.upgradeCompleteAt === undefined && (b.level || 1) > 0)) {
    player.researchQueue = remaining;
    await savePlayer(player.playerId || 'player-1', player);
  }

  res.json(player);
});

export default router;
