import { z } from 'zod';
import { idSchema } from '../fields/id.schema';

export const getUserByIdSchema = z
  .object({
    id: idSchema
  });