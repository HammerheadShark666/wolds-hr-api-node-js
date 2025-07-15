import { Express } from 'express';

declare global {
  namespace NodeJS {
    interface Global {
      app?: Express;
      ACCESS_TOKEN?: string;
    }
  }
 
  var app: Express | undefined;
  var ACCESS_TOKEN: string | undefined;
}

export {};