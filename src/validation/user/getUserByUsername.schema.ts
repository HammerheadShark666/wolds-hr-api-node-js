import { z } from 'zod';
import { usernameSchema } from '../fields/username.schema';

export const getUserByUsernameSchema = z
  .object({
    username: usernameSchema
  });