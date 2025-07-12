import { BaseApi } from "./base";

export interface ApiDepartment extends BaseApi {
  id: string;
  name: string;
}

export interface AppDepartment{
  id: string;
  name: string;
}