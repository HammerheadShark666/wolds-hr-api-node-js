import { z } from 'zod';
import { DepartmentModel } from '../../models/department.model';
import { uniqueValidator } from '../utils/uniqueValidator';

const baseSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
});

export const createDepartmentSchema = baseSchema.superRefine(async (data, ctx) => {
  
  await uniqueValidator(DepartmentModel, 'name', 'Department name already exists')(data, ctx);
   
  if (data.name.length > 75) {
    ctx.addIssue({
      path: ['name'],
      code: 'custom',
      message: 'Department name cannot exceed 75 characters',
    });
  }
});