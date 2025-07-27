import { z } from 'zod';  
import { surnameSchema } from '../fields/surname.schema';
import { roleSchema } from '../fields/userRole.schema';
import { firstNameSchema } from '../fields/firstName.schema';
import { idSchema } from '../fields/id.schema';

export const updateUserSchema = z
  .object({
    id: idSchema, 
    surname: surnameSchema,
    firstName: firstNameSchema,
    role: roleSchema
  });