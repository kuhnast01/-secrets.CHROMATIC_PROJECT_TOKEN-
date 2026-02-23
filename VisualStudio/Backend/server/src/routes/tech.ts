import { Router } from 'express';
import { getPlayer, savePlayer } from '../lib/inMemoryStore';

const router = Router();

const TECH_NODES = [
  { id: 'tech-1', name: 'Advanced Alloys', description: 'Increase ship ATK by 5%', costData: 50, durationSec: 0, effect: { shipAtkPercent: 0.05 }, prereqs: [] },
  { id: 'tech-2', name: 'Command Protocols', description: 'Increase commander bonus by 3%', costData: 80, durationSec: 10, effect: { commanderBonus: 0.03 }, prereqs: ['tech-1'] },
  { id: 'tech-3', name: 'Reactor Efficiency', description: 'Increase energy production', costData: 40, durationSec: 5, effect: { energyPercent: 0.05 }, prereqs: ['tech-1'] }
];

// GET /api/tech
router.get('/', (_req, res) => {
  res.json({ tech: TECH_NODES });
});

// POST /api/tech/start -> apply immediately for MVP
// body: { playerId?, techId }
router.post('/start', async (req, res) => {
  const { playerId = 'player-1', techId } = req.body;
  const node = TECH_NODES.find(t => t.id === techId);
  if (!node) return res.status(400).json({ error: 'unknown tech' });
  const player = (await getPlayer(playerId)) || { id: playerId, tech: {}, resources: {} };

  // check prerequisites
  player.tech = player.tech || {};
  const ownedTech = new Set(Object.keys(player.tech || {}));
  const unmet = (node.prereqs || []).filter((p:any) => !ownedTech.has(p));
  if (unmet.length > 0) return res.status(400).json({ error: 'prerequisites not met', unmet });

  // simple data-cost check
  const availableData = (player.resources?.data) || 0;
  if (availableData < node.costData) return res.status(400).json({ error: 'not enough data', required: node.costData, available: availableData });

  // deduct cost
  player.resources.data = availableData - node.costData;
  player.researchQueue = player.researchQueue || [];

  if ((node.durationSec || 0) > 0) {
    // enqueue research; will be applied when completed (GET /api/player/profile processes completed items)
    const endAt = Date.now() + (node.durationSec * 1000);
    player.researchQueue.push({ techId: node.id, endAt, effect: node.effect });
    await savePlayer(playerId, player);
    return res.json({ queued: true, endAt, player });
  }

  // immediate apply
  player.tech = player.tech || {};
  Object.entries(node.effect).forEach(([k, v]) => {
    player.tech[k] = (player.tech[k] || 0) + (v as number);
  });

  await savePlayer(playerId, player);
  res.json({ player });
});

export default router;
