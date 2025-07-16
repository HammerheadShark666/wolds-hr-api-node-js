import { UserModel, IUser } from '../models/user.model';

export async function getUserByEmail(email: string): Promise<IUser | null> { 
  return UserModel.findOne({ username: email }).exec();
}

export async function getUserById(id: string): Promise<IUser | null> { 
  return UserModel.findOne({ _id: id }).exec();
}

export async function getUsers(): Promise<IUser[] | null> { 
  return UserModel.find().exec();
}

export async function getUserByToken(token: string): Promise<IUser | null> {
  return UserModel.findOne({ tokens: token }).exec();
}

export async function createUser(data: Partial<IUser>): Promise<IUser> {
  const user = new UserModel(data);
  return user.save();
}

export async function updateUserTokens(userId: string, tokens: string[]) {
  return UserModel.findByIdAndUpdate(userId, { tokens }, { new: true }).exec();
}

export async function removeTokenFromAccount(token: string): Promise<boolean> {
  const account = await UserModel.findOne({ tokens: token }).exec();
  if (!account) return false;

  account.tokens = account.tokens.filter(t => t !== token);
  await account.save();

  return true;
}

export async function deleteUser(id: string): Promise<IUser | null> {
  return await UserModel.findByIdAndDelete(id);
}