import z from 'zod';
import { emailSchema } from '../fields/email.schema'; 
import { surnameSchema } from '../fields/surname.schema';
import { firstNameSchema } from '../fields/firstName.schema';
import { dateOfBirthSchema } from '../fields/dateOfBirth.schema';
import { hireDateSchema } from '../fields/hireDate.schema';
import { phoneNumberSchema } from '../fields/phoneNumber.schema';
import { departmentIdSchema } from '../fields/departmentId.schema';
import { objectIdSchema } from '../fields/objectId.schema';
  
export const updateEmployeeSchema = z.object({
  id: objectIdSchema,
  surname: surnameSchema,
  firstName: firstNameSchema,
  dateOfBirth: dateOfBirthSchema.optional(),
  hireDate: hireDateSchema.optional(),
  email: emailSchema.optional(),
  phoneNumber: phoneNumberSchema.optional(),
  departmentId: departmentIdSchema.optional(),
});