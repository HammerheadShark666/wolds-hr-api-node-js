
import { UserModel, IUser } from '../models/user.model';

export async function updateUserTokens(userId: string, tokens: string[]) {
  return await UserModel.findByIdAndUpdate(userId, { tokens }, { new: true }).exec();
}

export async function removeTokenFromUser(token: string): Promise<boolean> {
  const account = await UserModel.findOne({ tokens: token }).exec();
  if (!account) return false;

  account.tokens = account.tokens.filter(t => t !== token);
  await account.save();

  return true;
}