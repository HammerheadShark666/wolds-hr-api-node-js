import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { loginUser, logoutUser } from '../services/login.service';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../utils/authentication.helper';

export function createLoginRouter() {

  const router = Router();

  router.post(
    '/login',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await loginUser(req.body);  
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      }
      setRefreshTokenCookie(res, result.data.refreshToken); 
      setAccessTokenCookie(res, result.data.accessToken); 
      res.status(200).json({ message: 'Logged in' });    
    })
  );

  router.post(
    '/logout',
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.cookies.refresh_token;
      if (token) {
        await logoutUser({ refreshToken: token }); 
        res.clearCookie('refresh_token', { path: '/refresh-token' });
        res.clearCookie('access_token', { path: '/refresh-token' });
      }      
      res.sendStatus(204);     
    })
  ); 

  return router;
}