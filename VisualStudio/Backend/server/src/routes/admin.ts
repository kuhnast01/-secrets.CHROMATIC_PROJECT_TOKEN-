import { Router } from 'express';
import { savePlayer } from '../lib/inMemoryStore';

const router = Router();

// POST /api/admin/seed -> create a sample player record (dev only)
router.post('/seed', async (_req, res) => {
  const player = {
    id: 'player-1',
    level: 5,
    resources: { energy: 1200, alloy: 540, credits: 12000, data: 320 },
    tech: { shipAtkPercent: 0.0, commanderBonus: 0.0 },
    commanders: [],
    fleets: []
  };
  await savePlayer(player.id, player);
  res.json({ ok: true, player });
});

export default router;
