import { ObjectId, Schema, Types } from "mongoose";
import { IEmployee } from "../models/employee.model";

export interface ImportedEmployees {
  id: Types.ObjectId | null;
  date: Date;
  importedEmployeesCount: number;
  importEmployeesExistingCount: number;
  importEmployeesErrorsCount: number;
}

export interface ImportedEmployee
{
  id: Types.ObjectId;
  date: Date;
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
  importEmployeesId: Types.ObjectId | null | undefined;
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
  importEmployeesId: Types.ObjectId;
  createdAt?: Date;
}