import { Router, Request, Response } from 'express';
import { createTokenFromRefreshToken } from '../services/refreshToken.service';
import asyncHandler from 'express-async-handler';

export function createRefreshTokenRouter() {

  const router = Router(); 

  router.post(
    '/refresh-token',
    asyncHandler(async (req: Request, res: Response) => { 

      const refreshToken = req.cookies.refreshToken;   
      const refreshTokenResponse = await createTokenFromRefreshToken(refreshToken);
      if (!refreshTokenResponse.success) {
        res.status(401).json({ error: refreshTokenResponse.error });
        return;
      }

      res.status(200).json({ token: refreshTokenResponse.data.token });   
    })
  ); 

  return router;
}