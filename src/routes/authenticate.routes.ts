import { Response, Router } from 'express';   
import { validateAccessToken } from '../middleware/accessToken';
import {  LoginRequestExtension } from '../interface/login'; 
  
export function createAuthenticateRouter() {

  const router = Router();  

  router.get('/authentication/me', validateAccessToken, (req: LoginRequestExtension, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');

    const { account } = req;

    if (!account) return res.sendStatus(401);

    return res.json({
        message: 'Token is valid',
        user: account,
    });
  });
 
  return router;
};