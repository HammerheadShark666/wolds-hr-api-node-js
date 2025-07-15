import { Express } from 'express';

declare global {
  namespace NodeJS {
    interface Global {
      app?: Express;
      ACCESS_TOKEN?: string;
      departmentId: string;
    }
  }
 
  var app: Express | undefined;
  var ACCESS_TOKEN: string | undefined;
  var departmentId: string | undefined;
}

export {};