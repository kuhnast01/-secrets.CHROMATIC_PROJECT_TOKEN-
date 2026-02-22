import { Router } from 'express';
import { inMemory, savePlayer, saveFleet } from '../lib/inMemoryStore';

const router = Router();

// POST /api/admin/migrate -> copy in-memory players/fleets to Mongo (if available)
router.post('/migrate', async (_req, res) => {
  const migrated: any = { players: 0, fleets: 0 };
  for (const [id, p] of inMemory.players.entries()) {
    try { await savePlayer(id, p); migrated.players++; } catch (err) { /* ignore */ }
  }
  for (const [id, f] of inMemory.fleets.entries()) {
    try { await saveFleet(id, f); migrated.fleets++; } catch (err) { /* ignore */ }
  }
  res.json({ ok: true, migrated });
});

export default router;