import { phoneNumberSchema } from "../fields/phoneNumber.schema";
import { dateOfBirthSchema } from "../fields/dateOfBirth.schema";
import { hireDateSchema } from "../fields/hireDate.schema";
import z from "zod";
import { emailSchema } from "../fields/email.schema";
import { surnameSchema } from "../fields/surname.schema";
import { firstNameSchema } from "../fields/firstName.schema";
import { departmentIdSchema } from "../fields/departmentId.schema";
 
export const importEmployeeSchema = z.object({
  surname: surnameSchema,
  firstName: firstNameSchema,
  dateOfBirth: dateOfBirthSchema, //.nullable().optional(),
  hireDate: hireDateSchema, //.nullable().optional(),
  email: emailSchema, //.nullable().optional(),
  phoneNumber: phoneNumberSchema, //.nullable().optional(),
  departmentId: departmentIdSchema.nullable().optional(),
});
 
// export const importEmployeeSchemaWithCheck = importEmployeeSchema.superRefine(
//   async (data, ctx) => {
//     if (data.departmentId && Types.ObjectId.isValid(data.departmentId)) {
//       const exists = await DepartmentModel.exists({ _id: data.departmentId });
//       if (!exists) {
//         ctx.addIssue({
//           path: ["departmentId"],
//           code: "custom",
//           message: "Department does not exist in database",
//         });
//       }
//     }
//   }
// );