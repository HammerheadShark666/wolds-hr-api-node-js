import { Schema, model, Document, Types } from 'mongoose';

export interface IImportedEmployeeError extends Document {
  _id: Types.ObjectId; 
  employeeImportId: Types.ObjectId;
  employee: string;
  error: string;
}

const ImportedEmployeeErrorSchema = new Schema< IImportedEmployeeError>({  
  employee: { type: String, required: true, maxlength: 500 },
  error: { type: String, required: true, maxlength: 500 },
  employeeImportId: { type: Schema.Types.ObjectId, ref: 'EmployeeImport', required: false, default: null },
});

export const  ImportedEmployeeErrorModel = model< IImportedEmployeeError>(' ImportedEmployeeError',  ImportedEmployeeErrorSchema);