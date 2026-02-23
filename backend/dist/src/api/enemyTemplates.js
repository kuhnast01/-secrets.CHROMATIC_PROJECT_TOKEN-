import express from 'express';
import { getEnemyTemplateById } from '../models/EnemyTemplates';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();
// GET /api/enemy-templates/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    // Try DB first
    const dbTemplate = await prisma.enemyTemplate.findUnique({ where: { id } });
    if (dbTemplate)
        return res.json(dbTemplate);
    // Fallback to static (if not found in DB)
    const staticTemplate = getEnemyTemplateById(id);
    if (staticTemplate)
        return res.json(staticTemplate);
    return res.status(404).json({ error: 'Enemy template not found' });
});
// GET /api/enemy-templates
router.get('/', async (_req, res) => {
    const dbTemplates = await prisma.enemyTemplate.findMany();
    return res.json(dbTemplates);
});
export default router;
