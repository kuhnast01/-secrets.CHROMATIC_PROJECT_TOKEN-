import { Router } from 'express';

const router = Router();

// POST /api/combat/start  -> returns server-simulated combat log
router.post('/start', (req, res) => {
  const { fleet = {}, missionId = 'mission-1' } = req.body;
  // Minimal deterministic mock combat log for MVP
  const log = [
    { turn: 1, action: 'engage', detail: 'Player fleet fires' },
    { turn: 2, action: 'ability', detail: 'Commander used Overcharge' },
    { turn: 3, action: 'end', detail: 'Enemy defeated' }
  ];
  res.json({ missionId, result: 'victory', reward: { credits: 1000, alloy: 50 }, log });
});

// POST /api/combat/autobattle -> fast result
router.post('/autobattle', (req, res) => {
  const { playerPower = 1000, enemyPower = 800 } = req.body;
  const winChance = Math.min(0.99, Math.max(0.01, playerPower / (playerPower + enemyPower)));
  const win = Math.random() < winChance;
  res.json({ win, winChance });
});

export default router;
