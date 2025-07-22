import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { HttpError } from '../utils/classes/HttpError';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('❌ Error:', err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formatted = err.issues.map((e) => e.message); // <-- use .issues
    return res.status(400).json({ errors: formatted });
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({ errors });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ errors: [err.message] });
  }

  // Handle custom errors (optional)
  if (err.status && err.message) {
    return res.status(err.status).json({ errors: [err.message] });
  }

  // Fallback
  res.status(500).json({ errors: ['Internal server error'] });
}