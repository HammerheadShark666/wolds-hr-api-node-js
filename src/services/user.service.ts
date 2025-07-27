import { AddedUserResponse, AddUserRequest, UpdatedUserResponse, UpdateUserRequest, UserResponse } from '../interface/user';
import { UserModel, IUser } from '../models/user.model';
import { ServiceResult } from '../types/ServiceResult';
import { createHashedPassword } from '../utils/authentication.helper';
import { handleServiceError } from '../utils/error.helper';
import { toUserResponse } from '../utils/mapper';
import { addUserSchema } from '../validation/user/addUser.schema';
import { getUserByEmailSchema } from '../validation/user/getUserByEmail.schema';
import { getUserByIdSchema } from '../validation/user/getUserById.schema';
import { updateUserSchema } from '../validation/user/updateUser.schema';
import { validate } from '../validation/validate';

export async function addUser(data: AddUserRequest): Promise<ServiceResult<AddedUserResponse>> {
   
  const validationResult = await validate(addUserSchema, data); 
  if (!validationResult.success) {
    console.log("Validation failed: ", validationResult.error);
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
  const validData = validationResult.data;

  try {

    const updatedUser = await UserModel.findByIdAndUpdate(
      data.id,                          
      { $set: { surname: data.surname, firstName: data.firstName } },
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
  const validData = validationResult.data; 

  try { 

    const user = await UserModel.findById(validData.id).exec();
    // if (!user) {
    //   return { success: false, error: ['User not found'] };
    // }

    if (!user) {
      return {
        success: false,
        error: ['User not found'],
        code: 404
      };
    }

    return { success: true, data: toUserResponse(user) }; 
  } 
  catch (err: any) {
    return handleServiceError(err); 
  }
};




export async function getUserByEmail(email: string): Promise<ServiceResult<UserResponse>> {
 
  const validationResult = await validate(getUserByEmailSchema, {email});  
  if (!validationResult.success) {
    return validationResult;
  }  
  const validData = validationResult.data; 

  try { 

    const user = await UserModel.findOne({ username: email }).exec();
    if (!user) {
      return { success: false, error: ['User not found'], code: 404 };
    }

    return { success: true, data: toUserResponse(user) }; 
  } 
  catch (err: any) {
    return handleServiceError(err); 
  }
};


// export async function getUserByEmail(email: string): Promise<IUser | null> {
//   return await UserModel.findOne({ username: email }).exec();
// }


// export async function getUserById(id: string): Promise<IUser | null> { 
//   return await UserModel.findById({ _id: id }).exec();
// } 












 
export async function deleteUser(id: string): Promise<IUser | null> {
  return await UserModel.findByIdAndDelete(id);
} 



export async function usernameExists(id: string, username: string): Promise<boolean> {
  const user = await UserModel.findOne({ _id: { $ne: id }, username }).exec();
  return !!user;
}

export async function getUserByRefreshToken(refreshToken: string): Promise<IUser | null> {
  return await UserModel.findOne({ tokens: refreshToken }).exec();
} 
 
