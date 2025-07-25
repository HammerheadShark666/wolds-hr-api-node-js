import { z } from 'zod';  
import { validatePassword } from '../validator/validatePassword';
import { UserModel } from '../../models/user.model';
import { usernameSchema } from '../fields/username.schema';
import { passwordSchema } from '../fields/password.schema';
import { validateUnique } from '../validator/validateUnique';
import { surnameSchema } from '../fields/surname.schema';
import { roleSchema } from '../fields/userRole.schema';
import { firstNameSchema } from '../fields/firstname.schema';

export const addUserSchema = z
  .object({
    username: usernameSchema, 
    password: passwordSchema,
    confirmPassword: passwordSchema,
    surname: surnameSchema,
    firstName: firstNameSchema,
    role: roleSchema
  })
  .superRefine(async (data, ctx) => {
    validatePassword(data, ctx);
    await validateUnique(UserModel, 'username', 'Username already exists')(data, ctx);
  });