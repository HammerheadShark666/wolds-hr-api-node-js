import { Router, Request, Response } from 'express';
import { createTokenFromRefreshToken } from '../services/refreshToken.service';
import asyncHandler from 'express-async-handler';
import { setAccessTokenCookie } from '../utils/authentication.helper';

export function createRefreshTokenRouter() {

  const router = Router(); 

  router.post(
    '/refresh-token',
    asyncHandler(async (req: Request, res: Response) => { 
  
      const refreshToken = req.cookies.refresh_token;   
      const refreshTokenResponse = await createTokenFromRefreshToken(refreshToken);
      if (!refreshTokenResponse.success) {
        res.status(401).json({ error: refreshTokenResponse.error });
        return;
      }

      setAccessTokenCookie(res, refreshTokenResponse.data.accessToken); 
      res.status(200).json({ message: 'Token refreshed' });   
    })
  ); 

  return router;
}