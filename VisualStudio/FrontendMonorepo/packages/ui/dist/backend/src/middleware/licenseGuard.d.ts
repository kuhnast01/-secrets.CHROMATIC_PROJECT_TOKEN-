import { NextFunction, Request, Response } from 'express';
export declare function licenseGuard(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
