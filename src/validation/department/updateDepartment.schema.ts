import { z } from 'zod'; 
import { DepartmentModel } from '../../models/department.model';
import { departmentNameSchema } from './departmentName.schema';
 
export const updateDepartmentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(3, 'Department name must be at least 3 characters'),
}).superRefine(async (data, ctx) => {
    
  const existing = await DepartmentModel.findOne({ name: data.name });
  if (existing && existing.id !== data.id) {
    ctx.addIssue({
      path: ['name'],
      code: 'custom',
      message: 'Department name already exists',
    });
  }

  try {
    departmentNameSchema.parse(data.name);
  } catch (err) {
    if (err instanceof z.ZodError) {
      for (const issue of err.issues) {
        ctx.addIssue(issue);
      }
    }
  }

  // if (data.name.length > 75) {
  //   ctx.addIssue({
  //     path: ['name'],
  //     code: 'custom',
  //     message: 'Department name cannot exceed 75 characters',
  //   });
  // }
});
