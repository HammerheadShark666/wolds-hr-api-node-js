import { Schema, model, Document, Types } from 'mongoose';

export interface IEmployee extends Document {
  _id: Types.ObjectId;
  surname: string;
  firstName: string;
  dateOfBirth: Date;
  hireDate: Date;
  email: string;
  phoneNumber: string;
  photo: string;
  departmentId: Types.ObjectId;
  employeeImportId: Types.ObjectId;
  createdAt: Date;
  department?: {
    _id: Types.ObjectId;
    name: string;
  };
}

const EmployeeSchema = new Schema<IEmployee>({
  surname: { type: String, required: true, maxlength: 25 },  
  firstName: { type: String, required: true, maxlength: 25 }, 
  dateOfBirth: { type: Date, default: null },
  hireDate: { type: Date, default: null },
  email: { type: String, required: false, default: null, maxlength: 250, match: /.+@.+\..+/ },
  phoneNumber: { type: String, maxlength: 25, default: null }, 
  photo:  { type: String, required: false, maxlength: 100, default: null }, 
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: false, default: null },
  employeeImportId: { type: Schema.Types.ObjectId, ref: 'EmployeeImport', required: false, default: null },
  createdAt: { type: Date, default: Date.now }
});

EmployeeSchema.index({ employeeImportId: 1 });

export const EmployeeModel = model<IEmployee>('Employee', EmployeeSchema);