import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { loginUserAsync, logoutUserAsync } from '../services/login.service';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../utils/authentication.helper';

export function createLoginRouter() {

  const router = Router();

  router.post(
    '/login',
    asyncHandler(async (req: Request, res: Response) => {
      const response = await loginUserAsync(req.body);  
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }
      setRefreshTokenCookie(res, response.data.refreshToken); 
      setAccessTokenCookie(res, response.data.accessToken); 
      res.status(200).json({ message: 'Logged in' });    
    })
  );

  router.post(
    '/logout',
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.cookies.refresh_token;
      if (token) {
        await logoutUserAsync({ refreshToken: token }); 
        res.clearCookie('refresh_token', { path: '/refresh-token' });
        res.clearCookie('access_token', { path: '/refresh-token' });
      }      
      res.sendStatus(204);     
    })
  ); 

  return router;
}