import { Router, Request, Response } from 'express';
import { createTokenFromRefreshTokens } from '../services/refreshToken.service';
import asyncHandler from 'express-async-handler';

export function createRefreshTokenRouter() {

  const router = Router(); 

  router.post(
    '/refresh-token',
    asyncHandler(async (req: Request, res: Response) => {

      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res.sendStatus(401);
        return;
      }

      const refreshTokenResponse = await createTokenFromRefreshTokens(refreshToken);
      if (!refreshTokenResponse.success) {
        res.status(401).json({ error: refreshTokenResponse.error[0] });
        return;
      }

      res.status(200).json({ token: refreshTokenResponse.data.token });   
    })
  ); 

  return router;
}