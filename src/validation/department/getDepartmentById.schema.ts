import { z } from 'zod';
import { idSchema } from '../fields/id.schema';

export const getDepartmentByIdSchema = z
  .object({
    id: idSchema
  });