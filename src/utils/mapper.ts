import { AddUserRequest, UpdateUserRequest, UserResponse } from "../interface/user";
import { DepartmentResponse } from "../interface/department";
import { IDepartment } from "../models/department.model"; 
import { IUser } from "../models/user.model";
import { EmployeeResponse } from "../interface/employee";
import { IEmployee } from "../models/employee.model";

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

export function toEmployeeSearchResponse(employee: IEmployee): EmployeeResponse {
  const { _id, surname, firstName, email, phoneNumber } = employee;
  const appEmployee: EmployeeResponse = {
    id: _id.toString(),
    surname: surname, 
    firstName: firstName,
    email: email,
    phoneNumber: phoneNumber
  }; 
  return appEmployee;
}