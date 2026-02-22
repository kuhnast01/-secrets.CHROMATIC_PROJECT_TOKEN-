
import express from 'express';
import { getPlayer, savePlayer } from '../lib/inMemoryStore';

const router = express.Router();

// --- MVP sector/mission data ---
export const SECTORS = [
  {
    id: 1,
    name: 'The Fractured Reach',
    theme: 'A dead frontier where something ancient is waking.',
    enemyFaction: 'Wraithbound',
    recommendedPower: { min: 1000, max: 8000 },
    missions: [
      {
        id: '1-1',
        name: 'First Echo',
        type: 'standard',
        enemy: [{ type: 'Frigate', count: 2 }],
        power: 1000,
        description: 'First easy win, fast dopamine. Teach combat, give first commander shard.',
        rewards: { energy: 100, alloy: 50, commanderShard: 1 },
        modifiers: [],
      },
      {
        id: '1-2',
        name: 'Signal Drift',
        type: 'standard',
        enemy: [{ type: 'Frigate', count: 3 }],
        power: 1300,
        description: 'Slight difficulty bump, introduce resource diversity.',
        rewards: { credits: 120, alloy: 60 },
        modifiers: [],
      },
      {
        id: '1-3',
        name: 'Ghost Formation',
        type: 'puzzle',
        enemy: [
          { wave: 1, ships: [{ type: 'Frigate', count: 3 }] },
          { wave: 2, ships: [{ type: 'Destroyer', count: 2 }] },
          { wave: 3, ships: [{ type: 'Cruiser', count: 1 }] }
        ],
        power: 13000,
        description: 'Endurance test. Push players to upgrade ships.',
        rewards: { credits: 400, alloy: 250 },
        modifiers: [],
      },
      // STRONGHOLD 1
      {
        id: '2-stronghold-1',
        name: 'The Scavenger Forge',
        type: 'stronghold',
        enemy: [{ type: 'Cruiser', count: 1 }, { type: 'Destroyer', count: 2 }],
        power: 14000,
        description: 'First real difficulty spike. Enemies gain +5% ATK per turn.',
        rewards: { blueprint: 1, rareAlloy: 1, commanderShard: 1 },
        modifiers: ['Enemies gain +5% ATK per turn'],
      },
      // ...rest of sector 1 and other sectors...
    ],
  },
  // ...other sectors...
];

// GET /api/sectors/progress
router.get('/sectors/progress', async (req, res) => {
  const playerId = (req.query.playerId as string) || 'player-1';
  const player = (await getPlayer(playerId)) || { id: playerId, sectorProgress: {} };
  res.json({ sectorProgress: player.sectorProgress || {} });
});

// POST /api/missions/complete
router.post('/missions/complete', async (req, res) => {
  const playerId = (req.body.playerId as string) || 'player-1';
  const sectorId = req.body.sectorId || 1;
  const missionId = req.body.missionId;
  const result = req.body.result || 'win';
  const player = (await getPlayer(playerId)) || { id: playerId, sectorProgress: {} };
  player.sectorProgress = player.sectorProgress || {};
  player.sectorProgress[sectorId] = player.sectorProgress[sectorId] || { completed: [] };
  if (result === 'win') {
    player.sectorProgress[sectorId].completed.push(missionId);
    // Grant rewards (simplified)
    const sector = SECTORS.find(s => s.id === sectorId);
    let mission;
    if (sector && sector.missions) {
      mission = sector.missions.find((m: any) => m.id === missionId);
    }
    if (mission && mission.rewards) {
      player.resources = player.resources || {};
      Object.entries(mission.rewards).forEach(([k, v]) => {
        player.resources[k] = (player.resources[k] || 0) + (v as number);
      });
    }
    await savePlayer(playerId, player);
    return res.json({ success: true, rewards: mission?.rewards || {} });
  }
  res.json({ success: false });
});

export { router };

// GET /api/sectors/progress
router.get('/sectors/progress', async (req, res) => {
  const playerId = (req.query.playerId as string) || 'player-1';
  const player = (await getPlayer(playerId)) || { id: playerId, sectorProgress: {} };
  res.json({ sectorProgress: player.sectorProgress || {} });
});

// POST /api/missions/complete
router.post('/missions/complete', async (req, res) => {
  const playerId = (req.body.playerId as string) || 'player-1';
  const sectorId = req.body.sectorId || 1;
  const missionId = req.body.missionId;
  const result = req.body.result || 'win';
  const player = (await getPlayer(playerId)) || { id: playerId, sectorProgress: {} };
  player.sectorProgress = player.sectorProgress || {};
  player.sectorProgress[sectorId] = player.sectorProgress[sectorId] || { completed: [] };
  if (result === 'win') {
    player.sectorProgress[sectorId].completed.push(missionId);
    // Grant rewards (simplified)
    const sector = SECTORS.find(s => s.id === sectorId);
    let mission;
    if (sector && sector.missions) {
      mission = sector.missions.find((m: any) => m.id === missionId);
    }
    if (mission && mission.rewards) {
      player.resources = player.resources || {};
      Object.entries(mission.rewards).forEach(([k, v]) => {
        player.resources[k] = (player.resources[k] || 0) + (v as number);
      });
    }
    await savePlayer(playerId, player);
    return res.json({ success: true, rewards: mission?.rewards || {} });
  }
  res.json({ success: false });
});

