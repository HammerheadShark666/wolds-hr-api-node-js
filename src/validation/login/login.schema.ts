import { z } from 'zod';  
import { validatePassword } from '../validator/validatePassword';
import { usernameSchema } from '../fields/username.schema';
import { passwordSchema } from '../fields/password.schema';

export const loginSchema = z
  .object({
    username: usernameSchema, 
    password: passwordSchema
  })
  .superRefine(async (data, ctx) => {
    validatePassword(data, ctx);
  });