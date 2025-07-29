import { z } from 'zod';
import { departmentNameSchema } from './fields/departmentName.schema';

export const getDepartmentByNameSchema = z
  .object({
    name: departmentNameSchema
  });