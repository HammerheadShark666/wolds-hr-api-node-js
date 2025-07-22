import { z } from 'zod';

export const departmentNameSchema = z
  .string()
  .min(2, 'Department name must be at least 2 characters')
  .max(75, 'Department name cannot exceed 75 characters');