import { Router } from 'express';
import { getEvents, clearEvents } from '../lib/analytics';

const router = Router();

// GET /api/admin/analytics?since=timestamp
router.get('/', async (_req, res) => {
  const since = Number(_req.query.since) || undefined;
  const ev = await getEvents(since);
  res.json({ events: ev });
});

// POST /api/admin/analytics/clear
router.post('/clear', async (_req, res) => {
  await clearEvents();
  res.json({ ok: true });
});

export default router;
