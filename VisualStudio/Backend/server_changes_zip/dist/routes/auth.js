"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post('/login', (req, res) => {
    const { playerId = 'player-1' } = req.body;
    // For MVP scaffold we return a dummy token
    res.json({ accessToken: `dummy-token-for-${playerId}`, playerId });
});
exports.default = router;
