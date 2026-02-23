"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /api/fleet/save
router.post('/save', (req, res) => {
    const { fleet } = req.body;
    res.json({ fleetId: 'fleet-1', fleet });
});
// POST /api/ships/build (proxy placeholder)
router.post('/ships/build', (req, res) => {
    const { shipType = 'Frigate' } = req.body;
    res.json({ shipId: `ship-${Date.now()}`, shipType, status: 'building' });
});
exports.default = router;
