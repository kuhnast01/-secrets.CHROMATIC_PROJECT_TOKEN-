import { Router } from 'express';
import { getPlayer, savePlayer } from '../lib/inMemoryStore';

const router = Router();

// POST /api/store/purchase
// body: { playerId?, type: 'shards'|'shards_premium'|'premiumPack', commanderId, amount, receipt }
router.post('/purchase', async (req, res) => {
  const { playerId = 'player-1', type, commanderId, amount = 1, receipt } = req.body;
  const player = (await getPlayer(playerId)) || { id: playerId, resources: {}, commanders: [] };

  // buy shards using credits
  if (type === 'shards') {
    const pricePerShard = 100; // credits per shard (MVP)
    const total = pricePerShard * Number(amount);
    const credits = (player.resources?.credits) || 0;
    if (credits < total) return res.status(400).json({ error: 'not enough credits', required: total, available: credits });

    player.resources.credits = credits - total;
    const cmdr = (player.commanders || []).find((c:any) => c.id === commanderId);
    if (!cmdr) return res.status(404).json({ error: 'commander not found' });
    cmdr.shards = (cmdr.shards || 0) + Number(amount);

    await savePlayer(playerId, player);
    return res.json({ player, commander: cmdr });
  }

  // buy shards using premium currency
  if (type === 'shards_premium') {
    const pricePerShard = 1; // premium currency
    const total = pricePerShard * Number(amount);
    const gems = (player.resources?.gems) || 0;
    if (gems < total) return res.status(400).json({ error: 'not enough premium currency', required: total, available: gems });
    player.resources.gems = gems - total;
    const cmdr = (player.commanders || []).find((c:any) => c.id === commanderId);
    if (!cmdr) return res.status(404).json({ error: 'commander not found' });
    cmdr.shards = (cmdr.shards || 0) + Number(amount);
    await savePlayer(playerId, player);
    return res.json({ player, commander: cmdr });
  }

  // purchase premium currency (receipt validation via active provider)
  if (type === 'premiumPack') {
    // amount = gems to grant, receipt required
    const { activeProvider } = require('../lib/paymentProviders');
    const { logEvent } = require('../lib/analytics');
    const verification = await activeProvider.verifyReceipt(receipt);
    if (!verification?.valid) return res.status(400).json({ error: 'invalid receipt', provider: verification.provider });
    player.resources.gems = (player.resources?.gems || 0) + Number(amount);
    await savePlayer(playerId, player);
    logEvent('purchase', { playerId, type, amount, provider: verification.provider });
    return res.json({ player });
  }

  return res.status(400).json({ error: 'unsupported purchase type' });
});

export default router;
