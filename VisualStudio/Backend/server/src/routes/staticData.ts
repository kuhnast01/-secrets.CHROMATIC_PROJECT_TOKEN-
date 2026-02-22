import { Router } from 'express';

const router = Router();

// GET /api/static/sectors
router.get('/sectors', (_req, res) => {
  res.json({ sectors: [1, 2, 3, 4, 5] });
});

// GET /api/static/ships  -> return detailed ship stats for client
router.get('/ships', (_req, res) => {
  res.json({ ships: [
    { type: 'Frigate', atk: 12, def: 6, hp: 80, spd: 18, buildCost: { alloy: 40, credits: 120 }, buildTimeSec: 10 },
    { type: 'Destroyer', atk: 28, def: 18, hp: 220, spd: 12, buildCost: { alloy: 140, credits: 420 }, buildTimeSec: 30 },
    { type: 'Cruiser', atk: 62, def: 48, hp: 560, spd: 8, buildCost: { alloy: 520, credits: 1600 }, buildTimeSec: 90 },
    { type: 'Battleship', atk: 140, def: 110, hp: 1400, spd: 5, buildCost: { alloy: 1600, credits: 5200 }, buildTimeSec: 300 },
    { type: 'Carrier', atk: 40, def: 60, hp: 1000, spd: 6, buildCost: { alloy: 2200, credits: 8000 }, buildTimeSec: 600 }
  ] });
});

export default router;
