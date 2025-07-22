import { z } from 'zod'; 
import { DepartmentModel } from '../../models/department.model';

export const deleteDepartmentSchema = z.object({
  id: z.string().min(1, 'ID is required') 
}).superRefine(async (data, ctx) => {
  const existing = await DepartmentModel.findById(data.id); 
  if (!existing) {
    ctx.addIssue({
      path: ['id'],
      code: 'custom',
      message: 'Department not found',
    });
  }
});