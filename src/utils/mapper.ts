import { UserResponse } from "../interface/user";
import { DepartmentResponse } from "../interface/department";
import { IDepartment } from "../models/department.model";
import { IUser } from "../models/user.model";

export function toDepartmentResponse(department: IDepartment): DepartmentResponse {
  const { id, name } = department;
  const appDepartment: DepartmentResponse = {
    id: id,
    name: name
  }; 
  return appDepartment;
} 

export function toUserResponse(user: IUser): UserResponse {
  const { _id, username, role } = user;
  const appUser: UserResponse = {
    id: _id.toString(),
    username: username, 
    role: role, 
  }; 
  return appUser;
}