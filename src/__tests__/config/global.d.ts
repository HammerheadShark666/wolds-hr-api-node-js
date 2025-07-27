import { Express } from 'express';

declare global {
  namespace NodeJS {
    interface Global {
      app?: Express;
      ACCESS_TOKEN?: string;
      REFRESH_TOKEN?: string;
      departmentId: string;
      userId: string;
      username: string;
      password: string;
    }
  }
 
  var app: Express | undefined;
  var ACCESS_TOKEN: string | undefined;
  var REFRESH_TOKEN: string | null;
  var departmentId: string | undefined;
  var userId: string | undefined;
  var username: string | undefined;
  var password: string | undefined;
}

export {};