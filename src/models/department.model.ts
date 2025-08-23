import { Schema, model, Document, Types } from 'mongoose';

export interface IDepartment extends Document {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true, unique: true, maxlength: 75 },  
  createdAt: { type: Date, default: Date.now }
});

export const DepartmentModel = model<IDepartment>('Department', DepartmentSchema);