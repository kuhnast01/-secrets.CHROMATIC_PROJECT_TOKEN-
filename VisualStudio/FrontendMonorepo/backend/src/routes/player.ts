import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create a new player
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;
    const player = await prisma.player.create({
      data: { username, email },
    });
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: Number(req.params.id) },
      include: { resources: true, buildings: true, commanders: true, ships: true, techs: true, sectors: true, missions: true, guild: true },
    });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update player
router.put('/:id', async (req, res) => {
  try {
    const { username, email, isVIP, meta } = req.body;
    const player = await prisma.player.update({
      where: { id: Number(req.params.id) },
      data: { username, email, isVIP, meta },
    });
    res.json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete player
router.delete('/:id', async (req, res) => {
  try {
    await prisma.player.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
