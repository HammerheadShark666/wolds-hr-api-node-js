import { Request } from 'express';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LoginRequestExtension extends Request {
  account?: {
    userId: string;
    iat: number;
    exp: number;
  };
} 