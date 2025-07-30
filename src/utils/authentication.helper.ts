import { Response } from 'express';
import jwt from 'jsonwebtoken'; 
import { Types } from 'mongoose';
import type { StringValue } from 'ms'; 
import bcrypt from 'bcryptjs';

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
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
}

export function setAccessTokenCookie(res: Response, accessToken: string): void {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
}

export function getAccessToken(userId: Types.ObjectId): string {
  const token = jwt.sign({ userId: userId }, getAccessTokenSecret(), {
      expiresIn: getAccessTokenExpiry() as StringValue
  });
  return token;
}

export function getRefreshToken(userId: Types.ObjectId): string {
  const refreshToken = jwt.sign({ userId: userId }, getRefreshTokenSecret(), {
    expiresIn: getRefreshTokenExpiry() as StringValue
  });
  return refreshToken;
}

export async function createHashedPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt); 
}

export async function verifyPassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, hashedPassword);
}