import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare function getEvents(req: AuthRequest, res: Response): Promise<void>;
export declare function addEvent(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
