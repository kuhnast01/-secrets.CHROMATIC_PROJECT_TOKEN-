import { Request, Response, NextFunction } from 'express';

export default function adminAuth(req: Request, res: Response, next: NextFunction) {
  // tests bypass auth for convenience
  if (process.env.NODE_ENV === 'test' || process.env.DISABLE_ADMIN_AUTH === 'true') return next();
  const token = (req.headers['x-admin-secret'] || req.headers['x-admin']) as string | undefined;
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_TOKEN;
  if (!secret) return res.status(403).json({ error: 'admin_auth_not_configured' });
  if (token === secret) return next();
  return res.status(401).json({ error: 'unauthorized' });
}