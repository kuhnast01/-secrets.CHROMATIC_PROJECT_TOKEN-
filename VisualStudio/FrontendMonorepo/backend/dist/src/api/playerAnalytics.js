import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();
router.get('/player/:playerId/analytics', async (req, res) => {
    const { playerId } = req.params;
    // Example analytics aggregation
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
export default router;
