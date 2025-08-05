import { z } from 'zod';
import { idSchema } from '../fields/id.schema';

export const deleteUserSchema = z
  .object({
    id: idSchema
  });