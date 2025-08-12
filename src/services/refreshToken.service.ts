
import { RefreshTokenResponse } from '../interface/refreshToken';
import { UserModel, IUser } from '../models/user.model'; 
import jwt from 'jsonwebtoken'; 
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { ServiceResult } from '../types/ServiceResult';
import { handleServiceError } from '../utils/error.helper';
import { refreshTokenSchema } from '../validation/fields/refreshToken.schema';
import { validate } from '../validation/validate';
import { getAccessTokenExpiry } from '../utils/authentication.helper';
import { AUTHENTICATION_ERRORS } from '../utils/constants';

//Service export functions

export async function createTokenFromRefreshTokenAsync(refreshToken: string): Promise<ServiceResult<RefreshTokenResponse>> {   
  
  const validationResult = await validate(refreshTokenSchema, refreshToken);  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  }   
     
  try { 
    const decoded = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
          return { success: false, error: [AUTHENTICATION_ERRORS.REFRESH_TOKEN_NOT_VALID] };
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

  } catch (err: unknown) {
    return handleServiceError(err);
  }
}  

export async function updateUserTokensAsync(userId: string, tokens: string[]) {
  return await UserModel.findByIdAndUpdate(userId, { tokens }, { new: true }).exec();
}

export async function removeTokenFromUserAsync(token: string): Promise<boolean> {
  const account = await UserModel.findOne({ tokens: token }).exec();
  if (!account) return false;

  account.tokens = account.tokens.filter(t => t !== token);
  await account.save();

  return true;
}