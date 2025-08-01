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

export async function addUserAsync(data: AddUserRequest): Promise<ServiceResult<AddedUserResponse>> {
   
  const validationResult = await validate(addUserSchema, data); 
  if (!validationResult.success) { 
    return { success: false, code: 400, error: validationResult.error }
  }  
  const validData = validationResult.data;
  
  try {   
   
     if ((await usernameExistsAsync(validData.username))) {
          return {success: false, code: 400, error: ['Username exists already']};
        }   

    validData.password = await createHashedPassword(validData.password);
 
    const user = new UserModel(validData);
    user.save();
 
    if (!user || !user._id) {
      return { success: false, error: ['Failed to add user'] };
    }

    const addedUserResponse: AddedUserResponse = { message: "User added successfully", userId: user._id.toString() }; 
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

    const { id: validId, surname: validSurname, firstName: validFirstName } = validationResult.data;
 
    const existingUser = await UserModel.findById(validId);  
    if (!existingUser) {
      return {success: false, code: 404, error: ['User not found']};
    } 
 
    const updatedUser = await UserModel.findByIdAndUpdate(
      validId,                          
      { $set: { surname: validSurname, firstName: validFirstName } },
      { new: true, upsert: false, runValidators: true }
    );

    if (!updatedUser) {
      return { success: false, error: ['Error updating user'], code: 404 };
    }
  
    const updatedUserResponse: UpdatedUserResponse = { message: "User updated successfully", userId: data.id }; 
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

    const { id: validId } = validationResult.data;

    const user = await UserModel.findById(validId).exec();
    if (!user) {
      return {
        success: false, error: ['User not found'], code: 404 };
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

    const { username: validUsername } = validationResult.data;

    const user = await UserModel.findOne({ username: validUsername }).exec();
    if (!user) {
      return { success: false, error: ['User not found'], code: 404 };
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

    const { id: validId } = validationResult.data;
 
    if (!(await userExistsAsync(validId))) {
      return {success: false, code: 404, error: ['User not found']};
    }   

    await UserModel.findByIdAndDelete(validId);
    return { success: true, data: { userId: validId, message: 'User deleted successfully', }, }; 
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