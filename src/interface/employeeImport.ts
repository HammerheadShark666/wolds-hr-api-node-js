import { ObjectId, Schema, Types } from "mongoose";
import { IEmployee } from "../models/employee.model";

export interface EmployeeImport {
  id: Types.ObjectId;
  date: Date;
  employees: IEmployee[];
  existingEmployees: IEmployee[];
}

export interface ImportEmployee { 
  surname: string;
  firstName: string;
  dateOfBirth: Date | null;
  hireDate?: Date | null;
  email?: string;
  phoneNumber?: string;
  photo?: string;
  departmentId?: Types.ObjectId | null;
  employeeImportId: Types.ObjectId | null | undefined;
  createdAt?: Date;
}

export interface EmployeeImported {
  id: ObjectId,
  surname: string;
  firstName: string;
  dateOfBirth?: Date | null;
  hireDate?: Date | null;
  email?: string;
  phoneNumber?: string;
  photo?: string;
  departmentId?: Types.ObjectId | null;
  employeeImportId: Types.ObjectId;
  createdAt?: Date;
}