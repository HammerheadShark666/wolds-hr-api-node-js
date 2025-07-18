import { z } from 'zod';

export const departmentNameSchema = z.string().min(1, 'Name is required').max(75, 'Department name cannot exceed 75 characters');
