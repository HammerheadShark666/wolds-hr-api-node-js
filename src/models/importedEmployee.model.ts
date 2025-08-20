import { Schema, model, Document, Types } from 'mongoose';

export interface IImportedEmployee extends Document {
  _id: Types.ObjectId;
  date: Date;
}

const ImportedEmployeeSchema = new Schema<IImportedEmployee>({  
  _id: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now }
});

export const ImportedEmployeeModel = model<IImportedEmployee>('ImportedEmployee', ImportedEmployeeSchema);