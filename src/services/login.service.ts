import { LoginRequest, LoginResponse, LogoutRequest } from "../interface/login";
import { UserModel } from "../models/user.model";
import { ServiceResult } from "../types/ServiceResult";
import { getAccessToken, getRefreshToken, verifyPassword } from "../utils/authentication.helper";
import { removeTokenFromUser } from "./refreshToken.service";
import { loginSchema } from "../validation/login/login.schema";
import { handleServiceError } from "../utils/error.helper";
import { validate } from "../validation/validate";

export async function loginUser(data: LoginRequest): Promise<ServiceResult<LoginResponse>> {
    
  const validationResult = await validate(loginSchema, data);  
  if (!validationResult.success) {
    return validationResult;
  }    

  try {

    const { username: validUsername, password: validPassword } = validationResult.data;
   
    const user = await UserModel.findOne({ username: validUsername });
    if (!user) {
      return { success: false, error: ['Invalid login'] };
    }
  
    const isValid = await verifyPassword(validPassword, user.password);
    if (!isValid) {
      return { success: false, error: ["Invalid login"] };
    }
 
    const tokens: LoginResponse = { accessToken: getAccessToken(user._id), refreshToken: getRefreshToken(user._id) };
    return { success: true, data: tokens };
  } 
  catch (err: any) {     
    return handleServiceError(err);
  }
}

export async function logoutUser(data: LogoutRequest): Promise<ServiceResult<void>> {

  let user = await UserModel.findOne({ refreshToken: data.refreshToken })
  if(user) {
    await removeTokenFromUser(data.refreshToken);
  } 

  return { success: true, data: undefined };
};