import { Router } from 'express';
import { getPlayer, savePlayer } from '../lib/inMemoryStore';

const router = Router();

const STATIC_COMMANDERS = [
  { id: 'cmdr-1', name: 'Varun Kade', rarity: 'Rare', powerMultiplier: 1.05, shardCost: 10 },
  { id: 'cmdr-2', name: 'Selene Myr', rarity: 'Epic', powerMultiplier: 1.12, shardCost: 25 },
  { id: 'cmdr-3', name: 'Izan Holo', rarity: 'Uncommon', powerMultiplier: 1.03, shardCost: 6 },
  { id: 'cmdr-4', name: 'Astra Nove', rarity: 'Legendary', powerMultiplier: 1.20, shardCost: 100 },
  { id: 'cmdr-5', name: 'Rook Vel', rarity: 'Common', powerMultiplier: 1.01, shardCost: 2 }
];

// GET /api/commanders
router.get('/', async (_req, res) => {
  res.json({ commanders: STATIC_COMMANDERS });
});

// POST /api/commanders/recruit
// body: { playerId?, commanderId }
router.post('/recruit', async (req, res) => {
  const { playerId = 'player-1', commanderId } = req.body;
  const player = (await getPlayer(playerId)) || { id: playerId, commanders: [], resources: {} };
  const base = STATIC_COMMANDERS.find(c => c.id === commanderId);
  if (!base) return res.status(400).json({ error: 'unknown commander' });

  const instance = { ...base, level: 1, shards: 0, recruitedAt: Date.now() };
  player.commanders = player.commanders || [];
  player.commanders.push(instance);
  await savePlayer(playerId, player);
  res.json({ commander: instance });
});

// POST /api/commanders/upgrade
// body: { playerId?, commanderId }
router.post('/upgrade', async (req, res) => {
  const { playerId = 'player-1', commanderId } = req.body;
  const player = await getPlayer(playerId);
  if (!player) return res.status(404).json({ error: 'player not found' });
  const cmdr = (player.commanders || []).find((c: any) => c.id === commanderId);
  if (!cmdr) return res.status(404).json({ error: 'commander not found' });

  const base = STATIC_COMMANDERS.find(c => c.id === commanderId) || { shardCost: 10 };
  const currentLevel = cmdr.level || 1;
  const shardCost = (base.shardCost || 10) * currentLevel; // cost scales with level
  const availableShards = cmdr.shards || 0;
  if (availableShards < shardCost) {
    return res.status(400).json({ error: 'not enough shards', required: shardCost, available: availableShards });
  }
  cmdr.shards = availableShards - shardCost;
  cmdr.level = currentLevel + 1;
  await savePlayer(playerId, player);
  res.json({ commander: cmdr });
});

// POST /api/commanders/grantShards (dev helper)
// body: { playerId?, commanderId, amount }
router.post('/grantShards', async (req, res) => {
  const { playerId = 'player-1', commanderId, amount = 1 } = req.body;
  const player = (await getPlayer(playerId)) || { id: playerId, commanders: [], resources: {} };
  const cmdr = (player.commanders || []).find((c: any) => c.id === commanderId);
  if (!cmdr) return res.status(404).json({ error: 'commander not found' });
  cmdr.shards = (cmdr.shards || 0) + Number(amount);
  await savePlayer(playerId, player);
  res.json({ commander: cmdr });
});

export default router;
