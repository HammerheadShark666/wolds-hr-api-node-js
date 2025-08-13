import { Response } from 'express';
import jwt from 'jsonwebtoken'; 
import { Types } from 'mongoose';
import type { StringValue } from 'ms'; 
import bcrypt from 'bcryptjs';
import { AUTHENTICATION_ERRORS, COOKIES, GLOBAL } from './constants';

export function getAccessTokenExpiry(): string {
  return process.env.ACCESS_TOKEN_EXPIRY || '15m';
}
 
export function getRefreshTokenExpiry(): string {
  return process.env.REFRESH_TOKEN_EXPIRY || '7d';
} 

export function getAccessTokenSecret(): string {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret)
        throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_SECRET_MISSING); 
  return accessTokenSecret;
}

export function getRefreshTokenSecret(): string {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret)
        throw new Error(AUTHENTICATION_ERRORS.REFRESH_TOKEN_SECRET_MISSING); 
  return refreshTokenSecret;
}

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie(COOKIES.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',    
    //secure: process.env.NODE_ENV === GLOBAL.PRODUCTION,
    //sameSite: process.env.NODE_ENV === GLOBAL.PRODUCTION ? GLOBAL.NONE : GLOBAL.LAX,
    path: '/',
  });
}

export function setAccessTokenCookie(res: Response, accessToken: string): void {
  res.cookie(COOKIES.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',    
    //secure: process.env.NODE_ENV === GLOBAL.PRODUCTION,
    //sameSite: process.env.NODE_ENV === GLOBAL.PRODUCTION ? GLOBAL.NONE : GLOBAL.LAX,
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