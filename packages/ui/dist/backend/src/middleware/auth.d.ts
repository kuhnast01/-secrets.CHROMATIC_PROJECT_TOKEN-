import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
type AuthUser = JwtPayload & {
    id: string;
};
export type AuthRequest = Request & {
    user?: AuthUser;
};
export declare function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction): void;
export {};
