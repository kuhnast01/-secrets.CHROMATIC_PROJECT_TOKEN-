import { Router } from 'express';

const router = Router();

// POST /api/fleet/save
router.post('/save', (req, res) => {
  const { fleet } = req.body;
  res.json({ fleetId: 'fleet-1', fleet });
});

// POST /api/ships/build (proxy placeholder)
router.post('/ships/build', (req, res) => {
  const { shipType = 'Frigate' } = req.body;
  res.json({ shipId: `ship-${Date.now()}`, shipType, status: 'building' });
});

export default router;
