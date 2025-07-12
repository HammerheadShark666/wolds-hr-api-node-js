import { ApiDepartment, AppDepartment } from "../interface/department";
import { ApiEmployee, AppEmployee } from "../interface/employee";

export function mapDepartment(apiDepartment: ApiDepartment): AppDepartment {
  const { id, name } = apiDepartment;
  const appDepartment: AppDepartment = {
    id: id,
    name: name
  }; 
  return appDepartment;
}

export function mapEmployee(apiEmployee: ApiEmployee): AppEmployee {
  const { id, surname, firstName } = apiEmployee;
  const appEmployee: AppEmployee = {
    id: id,
    surname: surname,
    firstName: firstName  
  }; 
  return appEmployee;
}