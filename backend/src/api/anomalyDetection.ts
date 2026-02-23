import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Automated anomaly detection endpoint
router.get('/analytics/anomalies', async (req, res) => {
  // Example: detect retention and monetization anomalies
  const events = await prisma.analyticsEvent.findMany({});
  const sessionEvents = events.filter(e => e.type === 'dashboard_view');
  const purchaseEvents = events.filter(e => e.type === 'purchase');
  const retentionRisk = sessionEvents.length < 10;
  const monetizationAnomaly = purchaseEvents.length < 2;
  res.json({ retentionRisk, monetizationAnomaly });
});

export default router;
