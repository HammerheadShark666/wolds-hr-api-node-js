import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { loginUser, logoutUser } from '../services/login.service';
import { setRefreshTokenCookie } from '../utils/authentication.helper';

export function createLoginRouter() {

  const router = Router();  

  router.post('/login', asyncHandler(async (req, res): Promise<void> => {
    
      const result = await loginUser(req.body);
      if (!result.success) {  
        res.status(400).json({ errors: result.error });
        return;
      }  

      setRefreshTokenCookie(res, result.data.refreshToken); 
      res.status(200).json({ token: result.data.token });    
  })); 

  router.post('/logout', async (req, res) => {
    
      const token = req.cookies.refreshToken;
      if (!token) 
        return res.sendStatus(204); 

      await logoutUser({ refreshToken: token });
 
      res.clearCookie('refreshToken', { path: '/refresh-token' });
      res.sendStatus(204);     
  });

  return router;
}