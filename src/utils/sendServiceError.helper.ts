import { Response } from 'express';

type ServiceErrorResult = {
  success: false;
  error: string[];
  code?: number;
};

export function sendServiceError(res: Response, result: ServiceErrorResult): void {
  res.status(result.code ?? 400).json({ errors: result.error });
}