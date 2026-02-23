import logger from '../utils/logger';
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export function auditLogger(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.path === '/healthz' || req.path === '/system-health') {
    return next();
  }

  // In production, log user, action, and details to DB
  logger.info({
    user: req.user?.id,
    method: req.method,
    path: req.path,
    body: req.body,
  }, 'Audit log');
  next();
}
