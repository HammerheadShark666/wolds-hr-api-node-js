import z from 'zod';
import { emailSchema } from '../fields/email.schema';
 
export const addEmployeeSchema = z.object({
  surname: z.string().min(1, 'Surname is required').max(25, 'Surname, maximum size is 25'),
  firstName: z.string().min(1, 'First name is required').max(25,'First name, maximum size is 25'),
  dateOfBirth: z.string()
                .refine((val) => !isNaN(Date.parse(val)), {
                  message: "Invalid date format",
                })
                .transform((val) => new Date(val)),
  hireDate: z.string()
                .refine((val) => !isNaN(Date.parse(val)), {
                  message: "Invalid date format",
                })
                .transform((val) => new Date(val)),
  email: emailSchema,          
});