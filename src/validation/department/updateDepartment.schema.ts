import { z } from 'zod'; 
import { DepartmentModel } from '../../models/department.model';
import { departmentNameSchema } from './fields/departmentName.schema';

export const updateDepartmentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: departmentNameSchema,
}).superRefine(async (data, ctx) => {
  const existing = await DepartmentModel.findOne({ name: data.name });
  if (existing && existing.id !== data.id) {
    ctx.addIssue({
      path: ['name'],
      code: 'custom',
      message: 'Department name already exists',
    });
  }
});