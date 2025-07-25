
import { RefreshTokenResponse } from '../interface/refreshToken';
import { UserModel, IUser } from '../models/user.model'; 
import jwt from 'jsonwebtoken'; 
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { ServiceResult } from '../types/ServiceResult';
import { handleServiceError } from '../utils/error.helper';

export async function createTokenFromRefreshTokens(refreshToken: string): Promise<ServiceResult<RefreshTokenResponse>> {
  try {
    const decoded = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') {
          return reject(new Error("Failed to refresh token"));
        }
        resolve(decoded as JwtPayload);
      });
    });

    const newToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshTokenResponse: RefreshTokenResponse = { token: newToken };

    return { success: true, data: refreshTokenResponse };

  } catch (err: any) {
    return handleServiceError(err);
  }
}  

export async function updateUserTokens(userId: string, tokens: string[]) {
  return await UserModel.findByIdAndUpdate(userId, { tokens }, { new: true }).exec();
}

export async function removeTokenFromUser(token: string): Promise<boolean> {
  const account = await UserModel.findOne({ tokens: token }).exec();
  if (!account) return false;

  account.tokens = account.tokens.filter(t => t !== token);
  await account.save();

  return true;
}