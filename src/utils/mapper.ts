import { UserResponse } from "../interface/user";
import { DepartmentResponse } from "../interface/department";
import { IDepartment } from "../models/department.model"; 
import { IUser } from "../models/user.model";
import { EmployeeResponse } from "../interface/employee";
import { IEmployee } from "../models/employee.model";
import { IImportedEmployee } from "../models/importedEmployee.model";
import { ImportedEmployeeHistory } from "../interface/importEmployeeHistory";

export function toDepartmentResponse(department: IDepartment): DepartmentResponse {
  const { id, name } = department;
  const appDepartment: DepartmentResponse = {
    id: id,
    name: name
  }; 
  return appDepartment;
} 

export function toUserResponse(user: IUser): UserResponse {
  const { id, surname, firstName, role } = user;
  const appUser: UserResponse = {
    id: id.toString(),
    surname: surname, 
    firstName: firstName,
    role: role, 
  }; 
  return appUser;
} 

export function toEmployeeResponse(employee: IEmployee): EmployeeResponse {
  const { _id, surname, firstName, dateOfBirth, hireDate, email, phoneNumber, photo, department, departmentId } = employee;
  const appEmployee: EmployeeResponse = {
    id: _id.toString(),
    surname: surname, 
    firstName: firstName,
    dateOfBirth: dateOfBirth,
    hireDate: hireDate,
    email: email,
    phoneNumber: phoneNumber,
    photo: photo,
    departmentId: departmentId?.toString() ?? '',
    department: {
      id: department?._id.toString() ?? '',
      name: department?.name ?? '',
    },
  }; 
 
  return appEmployee;
} 

export function toEmployeesImportHistoryResponse(importEmployees: IImportedEmployee[]): ImportedEmployeeHistory[] {
  return importEmployees.map(({ _id, date }) => ({
    id: _id,
    date
  }));
}