import { ApiDepartment, AppDepartment, NewDepartment } from "../interface/APIDepartment";

export function mapDepartment(apiDepartment: NewDepartment): AppDepartment {
  const { id, name } = apiDepartment;
  const appDepartment: AppDepartment = {
    id: id,
    name: name
  };

 
  return appDepartment;
}