import { Request, Response } from 'express';

import { getAuditLogs } from '../models/auditModel';
import logger from '../utils/logger';


// GET /audit - List audit logs (admin/auditor)
export async function getAudit(req: Request, res: Response) {
  try {
    const logs = await getAuditLogs();
    res.json(logs);
  } catch (err) {
    logger.error({ err }, 'Failed to fetch audit logs');
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
}
