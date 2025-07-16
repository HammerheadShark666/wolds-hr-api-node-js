import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { getUserByEmail, getUserByToken, getUsers, removeTokenFromAccount } from '../services/user.service';
import type { StringValue } from 'ms';
import { Response } from 'express';

export function createAuthenticationRouter() {

  const router = Router();  

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;  

      if (!username || !password)
        return res.status(400).json({ error: 'Missing fields' });

      const user = await getUserByEmail(username);
      if (!user)
        return res.status(400).json({ error: 'Invalid username or password' });
 
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid)
        return res.status(400).json({ error: 'Invalid username or password' });
      
      const accessToken = jwt.sign({ userId: user._id }, getAccessTokenSecret(), {
        expiresIn: getAccessTokenExpiry() as StringValue
      });

      const refreshToken = jwt.sign({ userId: user._id }, getRefreshTokenSecret(), {
        expiresIn: getRefreshTokenExpiry() as StringValue
      });

      setRefreshTokenCookie(res, refreshToken); 
      res.json({ token: accessToken });

    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }); 

  router.post('/logout', async (req, res) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) 
        return res.sendStatus(204);
 
      const account = await getUserByToken(token);
      if (account) {
        await removeTokenFromAccount(token);
      }
 
      res.clearCookie('refreshToken', { path: '/refresh-token' });
      res.sendStatus(204);
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).send('Internal server error');
    }
  });

  return router;
}

function getAccessTokenExpiry(): string {
  return process.env.ACCESS_TOKEN_EXPIRY || '15m';
}
 
function getRefreshTokenExpiry(): string {
  return process.env.REFRESH_TOKEN_EXPIRY || '7d';
} 

function getAccessTokenSecret(): string {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret)
        throw new Error('Access token secret missing'); 
  return accessTokenSecret;
}

function getRefreshTokenSecret(): string {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret)
        throw new Error('Refresh token secret missing'); 
  return refreshTokenSecret;
}

function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
}