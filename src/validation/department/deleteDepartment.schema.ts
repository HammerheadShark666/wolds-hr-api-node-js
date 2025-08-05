import { z } from 'zod'; 

export const deleteDepartmentSchema = z.object({
  id: z.string().min(1, 'ID is required') 
});