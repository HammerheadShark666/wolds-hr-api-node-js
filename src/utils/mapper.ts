import { AppUser } from "../interface/user";
import { AppDepartment } from "../interface/department";
import { AppEmployee } from "../interface/employee";
import { IDepartment } from "../models/department.model";
import { IUser } from "../models/user.model";

export function mapDepartment(department: IDepartment): AppDepartment {
  const { id, name } = department;
  const appDepartment: AppDepartment = {
    id: id,
    name: name
  }; 
  return appDepartment;
} 

export function mapUser(user: IUser): AppUser {
  const { _id, username, role } = user;
  const appUser: AppUser = {
    id: _id.toString(),
    username: username, 
    role: role, 
  }; 
  return appUser;
}