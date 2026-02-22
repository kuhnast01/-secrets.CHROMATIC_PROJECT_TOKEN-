import { Router } from 'express';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { playerId = 'player-1' } = req.body;
  // For MVP scaffold we return a dummy token
  res.json({ accessToken: `dummy-token-for-${playerId}`, playerId });
});

export default router;
