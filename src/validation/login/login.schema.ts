import { z } from 'zod';  
import { validatePassword } from '../validator/validatePassword';
import { UserModel } from '../../models/user.model';
import { usernameSchema } from '../fields/username.schema';
import { passwordSchema } from '../fields/password.schema';

export const loginSchema = z
  .object({
    username: usernameSchema, 
    password: passwordSchema
  })
  .superRefine(async (data, ctx) => {
    validatePassword(data, ctx);

    const user = await UserModel.findOne({ username: data.username })
    if (!user) {
      ctx.addIssue({
      path: ['username'],
      code: 'custom',
      message: 'Invalid login',
      });
    }   
  });