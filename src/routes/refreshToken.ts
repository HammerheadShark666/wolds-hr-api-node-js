import { Router } from 'express';
import { RxDatabase } from 'rxdb'; 
import { WoldsHrDatabaseCollections } from '../database/collection/databaseCollection'; 
import jwt from 'jsonwebtoken'; 
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export function createRefreshTokenRouter(db: RxDatabase<WoldsHrDatabaseCollections>) {

  const router = Router(); 
   
  router.post('/refresh-token', (req, res) => {

    try { 
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.sendStatus(401);

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
          if (err || !decoded || typeof decoded === 'string') return res.sendStatus(403);

          const newToken = jwt.sign(
            { id: decoded.id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '15m' }
          );

          res.json({ token: newToken });
        }
      );
    } catch (err) {
      console.error('Refresh Token error:', err);
      res.status(500).send('Internal server error');
    }
  }); 

  return router;
}