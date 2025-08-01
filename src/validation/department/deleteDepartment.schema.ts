import { z } from 'zod'; 
import { DepartmentModel } from '../../models/department.model';

export const deleteDepartmentSchema = z.object({
  id: z.string().min(1, 'ID is required') 
});