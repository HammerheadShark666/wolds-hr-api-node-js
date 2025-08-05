import { z } from 'zod';
import { departmentNameSchema } from './fields/departmentName.schema';

export const updateDepartmentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: departmentNameSchema,
});