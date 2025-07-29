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

export async function addUser(data: AddUserRequest): Promise<ServiceResult<AddedUserResponse>> {
   
  const validationResult = await validate(addUserSchema, data); 
  if (!validationResult.success) { 
    return validationResult;
  }  
  const validData = validationResult.data;
  
  try {   
   
    validData.password = await createHashedPassword(validData.password);
 
    const user = new UserModel(validData);
    user.save();
 
    if (!user || !user._id) {
      return { success: false, error: ['Failed to add user'] };
    }

    const addedUserResponse: AddedUserResponse = { message: "User added successfully", userId: user._id.toString() }; 
    return { success: true, data: addedUserResponse }; 
  } 
  catch (err: any) {
    return handleServiceError(err); 
  }
} 

export async function updateUser(data: UpdateUserRequest): Promise<ServiceResult<UpdatedUserResponse>> {
   
  const validationResult = await validate(updateUserSchema, data);  
  if (!validationResult.success) {
    return validationResult;
  }   

  try {

    const { id: validId, surname: validSurname, firstName: validFirstName } = validationResult.data;

    const updatedUser = await UserModel.findByIdAndUpdate(
      validId,                          
      { $set: { surname: validSurname, firstName: validFirstName } },
      { new: true, upsert: false, runValidators: true }
    );

    if (!updatedUser) {
      return { success: false, error: ['User not found'], code: 404 };
    }
  
    const updatedUserResponse: UpdatedUserResponse = { message: "User updated successfully", userId: data.id }; 
    return { success: true, data: updatedUserResponse }; 
  } 
  catch (err: any) {
    return handleServiceError(err); 
  }
}

export async function getUserById(id: string): Promise<ServiceResult<UserResponse>> {
 
  const validationResult = await validate(getUserByIdSchema, {id});  
  if (!validationResult.success) {
    return validationResult;
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
  catch (err: any) {
    return handleServiceError(err); 
  }
};
 
export async function getUserByUsername(username: string): Promise<ServiceResult<UserResponse>> {
 
  const validationResult = await validate(getUserByUsernameSchema, { username });
  if (!validationResult.success) {
    return validationResult;
  } 

  try { 

    const { username: validUsername } = validationResult.data;

    const user = await UserModel.findOne({ username: validUsername }).exec();
    if (!user) {
      return { success: false, error: ['User not found'], code: 404 };
    }

    return { success: true, data: toUserResponse(user) }; 
  } 
  catch (err: any) {
    return handleServiceError(err); 
  }
}; 

 
export async function deleteUser(id: string): Promise<ServiceResult<DeletedUserResponse>> {

  const validationResult = await validate(deleteUserSchema, {id});   
  if (!validationResult.success) {
    return validationResult;
  }   

  try {  

    const { id: validId } = validationResult.data;

    await UserModel.findByIdAndDelete(validId);
    return { success: true, data: { userId: validId, message: 'User deleted successfully', }, }; 
  } 
  catch (err: any) {
    return handleServiceError(err); 
  } 
}  

export async function usernameExists(id: string, username: string): Promise<boolean> {
  const user = await UserModel.findOne({ _id: { $ne: id }, username }).exec();
  return !!user;
}

export async function getUserByRefreshToken(refreshToken: string): Promise<IUser | null> {
  return await UserModel.findOne({ tokens: refreshToken }).exec();
}