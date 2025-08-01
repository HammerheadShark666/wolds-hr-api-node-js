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
  dateOfBirth: { type: Date, default: Date.now },
  hireDate: { type: Date, default: Date.now },
  email: { type: String, required: false, maxlength: 250, match: /.+@.+\..+/ },
  phoneNumber: { type: String, maxlength: 25 }, 
  photo:  { type: String, required: false, maxlength: 100 }, 
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: false },
  employeeImportId: { type: Schema.Types.ObjectId, ref: 'EmployeeImport', required: false },
  createdAt: { type: Date, default: Date.now }
});

export const EmployeeModel = model<IEmployee>('Employee', EmployeeSchema);