import { Router } from 'express';

const router = Router();

// GET /api/player/profile
router.get('/profile', (_req, res) => {
  res.json({
    playerId: 'player-1',
    level: 5,
    resources: {
      energy: 1200,
      alloy: 540,
      credits: 12000,
      data: 320
    }
  });
});

export default router;
