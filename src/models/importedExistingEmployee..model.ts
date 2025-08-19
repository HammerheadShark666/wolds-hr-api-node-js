import { Schema, model, Document, Types } from 'mongoose';

export interface IImportedExistingEmployee extends Document {
  _id: Types.ObjectId; 
  surname: string;
  firstName: string;
  dateOfBirth: Date | null; 
  email?: string;
  phoneNumber?: string;  
  employeeImportId: Types.ObjectId;
  createdAt: Date;
}

const ImportedExistingEmployeeSchema = new Schema<IImportedExistingEmployee>({  
  surname: { type: String, required: true, maxlength: 25 },  
  firstName: { type: String, required: true, maxlength: 25 }, 
  dateOfBirth: { type: Date, default: null }, 
  email: { type: String, required: false, default: null, maxlength: 250, match: /.+@.+\..+/ },
  phoneNumber: { type: String, maxlength: 25, default: null },  
  employeeImportId: { type: Schema.Types.ObjectId, ref: 'EmployeeImport', required: false, default: null },
  createdAt: { type: Date, default: Date.now }
});

export const ImportedExistingEmployeeModel = model<IImportedExistingEmployee>('ImportedExistingEmployee', ImportedExistingEmployeeSchema);