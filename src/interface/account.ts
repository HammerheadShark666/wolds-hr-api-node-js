import { BaseApi } from "./base";

export interface AppAccount {
  id: string;
  username: string;
  password: string;
  role: string;
  tokens: [];
}

export interface ApiAccount extends BaseApi {
  id: string;
  username: string;
  password: string;
  role: string;
  tokens: [];
}