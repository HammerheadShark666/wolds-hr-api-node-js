
import { RefreshTokenResponse } from '../interface/refreshToken';
import { UserModel, IUser } from '../models/user.model'; 
import jwt from 'jsonwebtoken'; 
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { ServiceResult } from '../types/ServiceResult';
import { handleServiceError } from '../utils/error.helper';
import { refreshTokenSchema } from '../validation/fields/refreshToken.schema';
import { validate } from '../validation/validate';
import { getAccessTokenExpiry } from '../utils/authentication.helper';

export async function createTokenFromRefreshToken(refreshToken: string): Promise<ServiceResult<RefreshTokenResponse>> {   
  const validationResult = await validate(refreshTokenSchema, refreshToken);  
  if (!validationResult.success) {
    return validationResult;
  }   
     
  try {

    const validRefreshToken  = validationResult.data;

    const decoded = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(validRefreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
          return { success: false, error: ['Refresh token not valid'] };
        }
        resolve(decoded as JwtPayload);
      });
    });

    const expiryTime = getAccessTokenExpiry() as jwt.SignOptions['expiresIn']; 

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: expiryTime }
    ); 

    const refreshTokenResponse: RefreshTokenResponse = { accessToken: newAccessToken };

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