import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { loginUser, logoutUser } from '../services/login.service';
import { setRefreshTokenCookie } from '../utils/authentication.helper';
import { handleError } from '../utils/error.helper';

export function createLoginRouter() {

  const router = Router();

  router.post(
    '/login',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await loginUser(req.body);
      if (!result.success) return handleError(res, result.error);

      setRefreshTokenCookie(res, result.data.refreshToken); 
      res.status(200).json({ token: result.data.token });    
    })
  );

  router.post(
    '/logout',
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.cookies.refreshToken;
      if (token) {
        await logoutUser({ refreshToken: token }); 
        res.clearCookie('refreshToken', { path: '/refresh-token' });
      }      
      res.sendStatus(204);     
   })
  ); 

  return router;
}