import { Response } from 'express';

export function getAccessTokenExpiry(): string {
  return process.env.ACCESS_TOKEN_EXPIRY || '15m';
}
 
export function getRefreshTokenExpiry(): string {
  return process.env.REFRESH_TOKEN_EXPIRY || '7d';
} 

export function getAccessTokenSecret(): string {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret)
        throw new Error('Access token secret missing'); 
  return accessTokenSecret;
}

export function getRefreshTokenSecret(): string {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret)
        throw new Error('Refresh token secret missing'); 
  return refreshTokenSecret;
}

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
}