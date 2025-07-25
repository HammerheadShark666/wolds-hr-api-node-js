import { AddedUserResponse, AddUserRequest, UpdatedUserResponse, UpdateUserRequest } from '../interface/user';
import { UserModel, IUser } from '../models/user.model';
import { ServiceResult } from '../types/ServiceResult';
import { createHashedPassword } from '../utils/authentication.helper';
import { handleServiceError } from '../utils/error.helper';
import { addUserSchema } from '../validation/user/addUser.schema';
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
 
  // const validationResult = await validate(addUserSchema, data); 
  // if (!validationResult.success) {
  //   return validationResult;
  // }  
  // const validData = validationResult.data;

  // const existingUser = await getUserById(id);
  //     if (!existingUser)
  //     {
  //       res.status(404).json({ error: 'User not found' });
  //       return;
  //     } 
      
  //     if (await usernameExists(id, username)){
  //       res.status(400).json({ error: 'User with the usename already exists' });
  //       return;
  //     } 
  

  try {

    const updatedUser = await UserModel.findByIdAndUpdate(
      data.id,                          
      { $set: { role: data.role, surname: data.surname, firstName: data.firstName } },
      { new: true, upsert: false, runValidators: true }
    );
  
    const updatedUserResponse: UpdatedUserResponse = { message: "User updated successfully", userId: data.id }; 
    return { success: true, data: updatedUserResponse }; 
  } 
  catch (err: any) {
    return handleServiceError(err); 
  }
}
 
export async function deleteUser(id: string): Promise<IUser | null> {
  return await UserModel.findByIdAndDelete(id);
} 

export async function getUserByEmail(email: string): Promise<IUser | null> {
  return await UserModel.findOne({ username: email }).exec();
}

export async function getUserById(id: string): Promise<IUser | null> { 
  return await UserModel.findById({ _id: id }).exec();
} 

export async function usernameExists(id: string, username: string): Promise<boolean> {
  const user = await UserModel.findOne({ _id: { $ne: id }, username }).exec();
  return !!user;
}

export async function getUserByRefreshToken(refreshToken: string): Promise<IUser | null> {
  return await UserModel.findOne({ tokens: refreshToken }).exec();
} 
 
