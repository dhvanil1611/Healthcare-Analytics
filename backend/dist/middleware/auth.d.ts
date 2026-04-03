import { Request, Response, NextFunction } from 'express';
type AuthRequest = Request & {
    user?: any;
};
declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default auth;
