import { z } from 'zod'; 
import { idSchema } from '../fields/id.schema';

export const deleteDepartmentSchema = z.object({
  id: idSchema
});