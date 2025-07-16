import { Schema, model, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  createdAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true, unique: true },  
  createdAt: { type: Date, default: Date.now }
});

export const DepartmentModel = model<IDepartment>('Department', DepartmentSchema);