"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /api/economy/resources
router.get('/resources', (_req, res) => {
    res.json({ energy: 1200, alloy: 540, credits: 12000, data: 320 });
});
// POST /api/economy/buildings/upgrade
router.post('/buildings/upgrade', (req, res) => {
    const { building = 'Energy Reactor', level = 1 } = req.body;
    res.json({ building, newLevel: level + 1, queued: true });
});
exports.default = router;
