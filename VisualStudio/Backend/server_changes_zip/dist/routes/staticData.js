"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /api/static/sectors
router.get('/sectors', (_req, res) => {
    res.json({ sectors: [1, 2, 3, 4, 5] });
});
// GET /api/static/ships
router.get('/ships', (_req, res) => {
    res.json({ ships: ['Frigate', 'Destroyer', 'Cruiser', 'Battleship', 'Carrier'] });
});
exports.default = router;
