import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    const formatted = err.issues.map((e) => e.message); 
    return res.status(400).json({ errors: formatted });
  }

  // Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({ errors });
  }

  // Custom errors (optional)
  if (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'message' in err
  ) {
    const customErr = err as { status: number; message: string };
    return res.status(customErr.status).json({ errors: [customErr.message] });
  }

  // Fallback
  res.status(500).json({ errors: ['Internal server error'] });
}