import { ApiDepartment, BaseDepartment } from "../interface/department";
import { ApiEmployee, BaseEmployee } from "../interface/employee";

export function mapDepartment(apiDepartment: ApiDepartment): BaseDepartment {
  const { id, name } = apiDepartment;
  const appDepartment: BaseDepartment = {
    id: id,
    name: name
  }; 
  return appDepartment;
}

export function mapEmployee(apiEmployee: ApiEmployee): BaseEmployee {
  const { id, surname, firstName } = apiEmployee;
  const appEmployee: BaseEmployee = {
    id: id,
    surname: surname,
    firstName: firstName  
  }; 
  return appEmployee;
}