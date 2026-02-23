import { Request, Response, NextFunction } from 'express';
export declare const securityHeaders: (req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const limiter: any;
export declare function require2FA(req: Request, res: Response, next: NextFunction): void;
