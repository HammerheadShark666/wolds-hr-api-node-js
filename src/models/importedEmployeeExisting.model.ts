import { Schema, model, Document, Types } from 'mongoose';

export interface IImportedEmployeeExisting extends Document {
  _id: Types.ObjectId; 
  surname: string;
  firstName: string;
  dateOfBirth: Date | null; 
  email?: string;
  phoneNumber?: string;  
  importEmployeesId: Types.ObjectId;
  createdAt: Date;
}

const ImportedEmployeeExistingSchema = new Schema<IImportedEmployeeExisting>({  
  surname: { type: String, required: true, maxlength: 25 },  
  firstName: { type: String, required: true, maxlength: 25 }, 
  dateOfBirth: { type: Date, default: null }, 
  email: { type: String, required: false, default: null, maxlength: 250, match: /.+@.+\..+/ },
  phoneNumber: { type: String, maxlength: 25, default: null },  
  importEmployeesId: { type: Schema.Types.ObjectId, ref: 'ImportEmployee', required: false, default: null },
  createdAt: { type: Date, default: Date.now }
});

export const ImportedEmployeeExistingModel = model<IImportedEmployeeExisting>('ImportedEmployeeExisting', ImportedEmployeeExistingSchema);