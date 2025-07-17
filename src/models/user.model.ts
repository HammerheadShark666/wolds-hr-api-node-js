import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: 'admin' | 'user';
  tokens: string[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  tokens: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = model<IUser>('User', userSchema, 'users');