import { Request, Response } from 'express';

import { getAllUsers } from '../models/userModel';
import logger from '../utils/logger';


// GET /users - List all users (admin only)
export async function getUsers(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    logger.error({ err }, 'Failed to fetch users');
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
