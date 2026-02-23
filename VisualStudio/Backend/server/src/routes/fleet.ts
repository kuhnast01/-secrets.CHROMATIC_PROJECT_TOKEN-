import { Router } from 'express';

const router = Router();

// POST /api/fleet/save
router.post('/save', async (req, res) => {
  const { fleet, playerId = 'player-1' } = req.body;
  const fleetId = `fleet-${Date.now()}`;
  // persist to store (in-memory or Mongo)
  try {
    const { saveFleet, savePlayer, getPlayer } = require('../lib/inMemoryStore');
    await saveFleet(fleetId, { id: fleetId, fleet, savedAt: Date.now(), playerId });

    // attach fleet ref to player record
    const player = (await getPlayer(playerId)) || { id: playerId, commanders: [], resources: {}, fleets: [] };
    player.fleets = player.fleets || [];
    player.fleets.push({ fleetId, createdAt: Date.now() });
    await savePlayer(playerId, player);
  } catch (err) {
    // ignore
  }
  res.json({ fleetId, fleet });
});

// GET /api/fleet/:id
router.get('/:id', async (req, res) => {
  const { getFleet } = require('../lib/inMemoryStore');
  const found = await getFleet(req.params.id);
  if (!found) return res.status(404).json({ error: 'fleet not found' });
  res.json(found);
});

// POST /api/ships/build (proxy placeholder)
router.post('/ships/build', (req, res) => {
  const { shipType = 'Frigate' } = req.body;
  res.json({ shipId: `ship-${Date.now()}`, shipType, status: 'building', etaSec: 10 });
});

export default router;
