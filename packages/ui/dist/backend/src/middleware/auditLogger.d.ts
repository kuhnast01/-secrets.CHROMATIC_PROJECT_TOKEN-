import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
export declare function auditLogger(req: AuthRequest, res: Response, next: NextFunction): void;
