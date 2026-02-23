"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EnemyTemplates_1 = require("../models/EnemyTemplates");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// GET /api/enemy-templates/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    // Try DB first
    const dbTemplate = await prisma.enemyTemplate.findUnique({ where: { id } });
    if (dbTemplate)
        return res.json(dbTemplate);
    // Fallback to static (if not found in DB)
    const staticTemplate = (0, EnemyTemplates_1.getEnemyTemplateById)(id);
    if (staticTemplate)
        return res.json(staticTemplate);
    return res.status(404).json({ error: 'Enemy template not found' });
});
// GET /api/enemy-templates
router.get('/', async (_req, res) => {
    const dbTemplates = await prisma.enemyTemplate.findMany();
    return res.json(dbTemplates);
});
exports.default = router;
