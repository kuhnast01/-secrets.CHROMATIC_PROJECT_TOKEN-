import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

type AuthUser = JwtPayload & {
  id: string;
};

export type AuthRequest = Request & {
  user?: AuthUser;
};

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const payload = (typeof user === 'object' && user !== null ? user : {}) as JwtPayload;
      req.user = {
        ...payload,
        id: String(payload.id ?? ''),
      };
      next();
    });
  } else {
    res.sendStatus(401);
  }
}
