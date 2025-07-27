import { z } from 'zod';
import { usernameSchema } from '../fields/username.schema';

export const getUserByEmailSchema = z
  .object({
    email: usernameSchema
  });