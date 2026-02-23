import { Router } from 'express';
import { runOnce, getMetrics } from '../lib/tickWorker';

const router = Router();
import adminAuth from '../lib/adminAuth';

const COOLDOWN_MS = Number(process.env.ADMIN_TICK_COOLDOWN_MS) || 3000;
let lastTriggerTs = 0;

// POST /api/admin/tick/trigger -> run one immediate tick (rate-limited)
router.post('/trigger', adminAuth, async (_req, res) => {
  const now = Date.now();
  if (now - lastTriggerTs < COOLDOWN_MS) {
    return res.status(429).json({ error: 'rate_limited', retryAfterMs: COOLDOWN_MS - (now - lastTriggerTs) });
  }
  lastTriggerTs = now;
  const out = await runOnce();
  res.json({ ok: true, processed: out.processed });
});

// GET /api/admin/tick/metrics -> return tick metrics
router.get('/metrics', adminAuth, (_req, res) => {
  res.json({ metrics: getMetrics(), cooldownMs: COOLDOWN_MS, lastTriggerTs });
});

export default router;
