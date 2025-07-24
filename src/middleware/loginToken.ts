import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'; 

export interface LoginRequest extends Request {
  account?: any;
}
  
export const loginToken = (req: LoginRequest, res: Response, next: NextFunction) => { 

  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, account) => {
    if (err) return res.sendStatus(403);
    req.account = account;
    next();
  });
};