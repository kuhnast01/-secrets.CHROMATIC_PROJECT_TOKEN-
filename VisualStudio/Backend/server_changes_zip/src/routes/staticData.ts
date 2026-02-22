import { Router } from 'express';

const router = Router();

// GET /api/static/sectors
router.get('/sectors', (_req, res) => {
  res.json({ sectors: [1, 2, 3, 4, 5] });
});

// GET /api/static/ships
router.get('/ships', (_req, res) => {
  res.json({ ships: ['Frigate', 'Destroyer', 'Cruiser', 'Battleship', 'Carrier'] });
});

export default router;
