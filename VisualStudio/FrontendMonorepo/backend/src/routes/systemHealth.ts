import { Router } from 'express';
const router = Router();

// System health endpoint for admin panel
router.get('/system-health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
