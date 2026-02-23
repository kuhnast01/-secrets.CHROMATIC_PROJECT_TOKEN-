import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Central analytics ingestion endpoint for frontend event tracking
router.post('/analytics/event', async (req, res) => {
  const { type, value, userId, timestamp, meta } = req.body;
  // Store event in database or forward to StudioIntelligence
  await prisma.analyticsEvent.create({
    data: { type, value, userId, timestamp, meta: JSON.stringify(meta || {}) }
  });
  res.status(201).json({ success: true });
});

// Existing player analytics aggregation
router.get('/player/:playerId/analytics', async (req, res) => {
  const { playerId } = req.params;
  const progression = await prisma.progression.findMany({ where: { playerId }, orderBy: { date: 'asc' } });
  const battles = [
    { type: 'Wins', value: await prisma.battle.count({ where: { playerId, outcome: 'win' } }) },
    { type: 'Losses', value: await prisma.battle.count({ where: { playerId, outcome: 'loss' } }) },
    { type: 'Draws', value: await prisma.battle.count({ where: { playerId, outcome: 'draw' } }) }
  ];
  const topShips = await prisma.shipUsage.findMany({ where: { playerId }, orderBy: { uses: 'desc' }, take: 5 });
  const achievements = await prisma.achievement.findMany({ where: { playerId }, orderBy: { date: 'desc' }, take: 10 });
  res.json({ progression, battles, topShips, achievements });
});

// Serve analytics events for live dashboard
router.get('/analytics/events', async (req, res) => {
  const events = await prisma.analyticsEvent.findMany({ orderBy: { timestamp: 'desc' }, take: 100 });
  res.json(events);
});

export default router;
