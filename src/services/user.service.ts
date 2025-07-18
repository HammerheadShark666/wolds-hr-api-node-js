import { UserModel, IUser } from '../models/user.model';

export async function getUserByEmail(email: string): Promise<IUser | null> {
  return await UserModel.findOne({ username: email }).exec();
}

export async function getUserById(id: string): Promise<IUser | null> { 
  return await UserModel.findOne({ _id: id }).exec();
}

export async function getOtherUserHasUsername(id: string, username: string): Promise<IUser | null> { 
  return await UserModel.findOne({ _id: { $ne: id }, username }).exec(); 
}

export async function getUserByRefreshToken(refreshToken: string): Promise<IUser | null> {
  return await UserModel.findOne({ tokens: refreshToken }).exec();
}

export async function createUser(data: Partial<IUser>): Promise<IUser> {
  const user = new UserModel(data);
  return user.save();
}

export async function updateUser(id: string, username: string, role: string): Promise<IUser | null> {
 
  const updatedUser = await UserModel.findByIdAndUpdate(
    id,                          
    { $set: { username: username, role: role}},
    { new: true, upsert: false, runValidators: true }
  );
 
  return updatedUser;
}
 
export async function deleteUser(id: string): Promise<IUser | null> {
  return await UserModel.findByIdAndDelete(id);
}