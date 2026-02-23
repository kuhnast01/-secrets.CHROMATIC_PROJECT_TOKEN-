"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file defines the battle/combat API for frontend integration.
const express_1 = require("express");
const CombatEngine_1 = require("../systems/CombatEngine");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/battle/simulate:
 *   post:
 *     summary: Simulate a battle between two fleets
 *     tags:
 *       - Battle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attackerFleet:
 *                 $ref: '#/components/schemas/Fleet'
 *               defenderFleet:
 *                 $ref: '#/components/schemas/Fleet'
 *               maxRounds:
 *                 type: integer
 *                 description: Maximum number of rounds
 *     responses:
 *       200:
 *         description: Battle simulation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                 log:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Battle simulation failed
 */
router.post('/simulate', (req, res) => {
    const { attackerFleet, defenderFleet, maxRounds } = req.body;
    if (!attackerFleet || !defenderFleet) {
        return res.status(400).json({ error: 'Both attackerFleet and defenderFleet are required.' });
    }
    try {
        const result = CombatEngine_1.CombatEngine.simulateBattle(attackerFleet, defenderFleet, maxRounds);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Battle simulation failed', details: err.message });
    }
});
exports.default = router;
