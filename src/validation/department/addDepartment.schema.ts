import z from 'zod';
import { departmentNameSchema } from './fields/departmentName.schema';

export const addDepartmentSchema = z.object({
  name: departmentNameSchema,
});