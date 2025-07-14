import { Express } from 'express';

declare global {
  var app: Express;
  var ACCESS_TOKEN: string;
}

export {};