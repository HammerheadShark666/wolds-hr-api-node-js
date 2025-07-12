import { ApiDepartment, BaseDepartment } from "../interface/department";

export function mapDepartment(apiDepartment: ApiDepartment): BaseDepartment {
  const { id, name } = apiDepartment;
  const appDepartment: BaseDepartment = {
    id: id,
    name: name
  }; 
  return appDepartment;
}