import { AppAuthenticate, AppAuthenticated, AppLogout } from "../interface/authenticated";
import { UserModel } from "../models/user.model";
import { ServiceResult } from "../types/ServiceResult";
import { authenticateSchema } from "../validation/authentication/authenticate.schema";
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { getAccessTokenExpiry, getAccessTokenSecret, getRefreshTokenExpiry, getRefreshTokenSecret } from "../utils/authentication.helper";
import { removeTokenFromUser } from "./refreshToken.service";

export async function authenticateUser(data: AppAuthenticate): Promise<ServiceResult<AppAuthenticated>> {
  
  const parsed = await authenticateSchema.safeParseAsync(data);
  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => issue.message);
    return { success: false, error: errors };
  }
 
  try {
   
    const user = await UserModel.findOne({ username: data.username });
    if (!user) {
      return { success: false, error: ['Username and password are invalid'] };
    }
    
    const token = jwt.sign({ userId: user._id }, getAccessTokenSecret(), {
        expiresIn: getAccessTokenExpiry() as StringValue
    });

    const refreshToken = jwt.sign({ userId: user._id }, getRefreshTokenSecret(), {
        expiresIn: getRefreshTokenExpiry() as StringValue
    });
    
    const tokens: AppAuthenticated = { token, refreshToken };

    return { success: true, data: tokens };
  } catch (err: any) {
     
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return { success: false, error: messages };
    }

    return { success: false, error: ['Unexpected error: ' + err.message] };
  }
}

export async function logoutUser(data: AppLogout): Promise<ServiceResult<void>> {

  let user = await UserModel.findOne({ refreshToken: data.refreshToken })
  if(user) {
    await removeTokenFromUser(data.refreshToken);
  } 

  return { success: true, data: undefined };
};