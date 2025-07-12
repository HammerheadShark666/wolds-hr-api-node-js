import { BaseApi } from "./base";

export interface AppEmployee {
  id: string;
  surname: string;
  firstName: string;
}

export interface ApiEmployee extends BaseApi {
  id: string;
  surname: string;
  firstName: string;
}