import { AddedUserResponse, AddUserRequest, DeletedUserResponse, UpdatedUserResponse, UpdateUserRequest, UserResponse } from '../interface/user';
import { UserModel, IUser } from '../models/user.model';
import { ServiceResult } from '../types/ServiceResult';
import { createHashedPassword } from '../utils/authentication.helper';
import { handleServiceError } from '../utils/error.helper';
import { toUserResponse } from '../utils/mapper';
import { addUserSchema } from '../validation/user/addUser.schema';
import { deleteUserSchema } from '../validation/user/deleteUserSchema';
import { getUserByUsernameSchema } from '../validation/user/getUserByUsername.schema';
import { getUserByIdSchema } from '../validation/user/getUserById.schema';
import { updateUserSchema } from '../validation/user/updateUser.schema';
import { validate } from '../validation/validate';
import { USER_ERRORS, USER_MESSAGES } from '../utils/constants';

//Service export functions

export async function addUserAsync(data: AddUserRequest): Promise<ServiceResult<AddedUserResponse>> {
   
  const validationResult = await validate(addUserSchema, data); 
  if (!validationResult.success) { 
    return { success: false, code: 400, error: validationResult.error }
  }   

  try {   
   
     if ((await usernameExistsAsync(data.username))) {
          return {success: false, code: 400, error: [USER_ERRORS.USERNAME_EXISTS]};
        }   

    data.password = await createHashedPassword(data.password);
 
    const user = new UserModel(data);
    user.save();
 
    if (!user || !user._id) {
      return { success: false, error: [USER_ERRORS.FAILED_TO_ADD] };
    }

    const addedUserResponse: AddedUserResponse = { message: USER_MESSAGES.ADDED_SUCCESSFULLY, userId: user._id.toString() }; 
    return { success: true, data: addedUserResponse }; 
  } 
  catch (err: unknown) {
    return handleServiceError(err); 
  }
} 

export async function updateUserAsync(data: UpdateUserRequest): Promise<ServiceResult<UpdatedUserResponse>> {
   
  const validationResult = await validate(updateUserSchema, data);  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  }   

  try {
 
    const existingUser = await UserModel.findById(data.id);  
    if (!existingUser) {
      return {success: false, code: 404, error: [USER_ERRORS.NOT_FOUND]};
    } 
 
    const updatedUser = await UserModel.findByIdAndUpdate(
      data.id,                          
      { $set: { surname: data.surname, firstName: data.firstName } },
      { new: true, upsert: false, runValidators: true }
    );

    if (!updatedUser) {
      return { success: false, error: ['Error updating user'], code: 404 };
    }
  
    const updatedUserResponse: UpdatedUserResponse = { message: USER_MESSAGES.UPDATED_SUCCESSFULLY, userId: data.id }; 
    return { success: true, data: updatedUserResponse }; 
  } 
  catch (err: unknown) {
    return handleServiceError(err); 
  }
}

export async function getUserByIdAsync(id: string): Promise<ServiceResult<UserResponse>> {
 
  const validationResult = await validate(getUserByIdSchema, {id});  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  }

  try { 
 
    const user = await UserModel.findById(id).exec();
    if (!user) {
      return {
        success: false, error: [USER_ERRORS.NOT_FOUND], code: 404 };
    }

    return { success: true, data: toUserResponse(user) }; 
  } 
  catch (err: unknown) {
    return handleServiceError(err); 
  }
};
 
export async function getUserByUsernameAsync(username: string): Promise<ServiceResult<UserResponse>> {
 
  const validationResult = await validate(getUserByUsernameSchema, { username });
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  } 

  try {  

    const user = await UserModel.findOne({ username: username }).exec();
    if (!user) {
      return { success: false, error: [USER_ERRORS.NOT_FOUND], code: 404 };
    }

    return { success: true, data: toUserResponse(user) }; 
  } 
  catch (err: unknown) {
    return handleServiceError(err); 
  }
}; 
 
export async function deleteUserAsync(id: string): Promise<ServiceResult<DeletedUserResponse>> {
  
  const validationResult = await validate(deleteUserSchema, {id});   
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  };   

  try {   
 
    if (!(await userExistsAsync(id))) {
      return {success: false, code: 404, error: [USER_ERRORS.NOT_FOUND]};
    }   

    await UserModel.findByIdAndDelete(id);
    return { success: true, data: { userId: id, message: USER_MESSAGES.DELETED_SUCCESSFULLY, }, }; 
  } 
  catch (err: unknown) {
    return handleServiceError(err); 
  } 
}  

export async function usernameExistsNotOnThisUserAsync(id: string, username: string): Promise<boolean> {
  const user = await UserModel.findOne({ _id: { $ne: id }, username }).exec();
  return !!user;
}

export async function userExistsAsync(id: string): Promise<boolean> {
  const user = await UserModel.findOne({ _id: id }).exec();
  return !!user;
}

export async function getUserByRefreshTokenAsync(refreshToken: string): Promise<IUser | null> {
  return await UserModel.findOne({ tokens: refreshToken }).exec();
}

export async function usernameExistsAsync(username: string): Promise<boolean> {
  const exists = await UserModel.exists({ 'username': username }).exec();
  return !!exists;
}