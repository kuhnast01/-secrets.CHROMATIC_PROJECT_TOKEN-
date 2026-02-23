import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Real-time dashboard endpoint
router.get('/dashboard/enemy-templates', async (_req, res) => {
  const templates = await prisma.enemyTemplate.findMany();
  const changes = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' }, take: 50 });
  res.json({ templates, changes });
});

// Advanced analytics endpoint
router.get('/dashboard/enemy-templates/analytics', async (_req, res) => {
  const totalTemplates = await prisma.enemyTemplate.count();
  const recentChanges = await prisma.auditLog.count({ where: { timestamp: { gte: new Date(Date.now() - 86400000).toISOString() } } });
  const bossCount = await prisma.enemyTemplate.count({ where: { bossAbility: { not: null } } });
  res.json({ totalTemplates, recentChanges, bossCount });
});

export default router;
