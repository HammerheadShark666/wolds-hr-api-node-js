import { phoneNumberSchema } from "../fields/phoneNumber.schema";
import { dateOfBirthSchema } from "../fields/dateOfBirth.schema";
import { hireDateSchema } from "../fields/hireDate.schema";
import z from "zod";
import { emailSchema } from "../fields/email.schema";
import { surnameSchema } from "../fields/surname.schema";
import { firstNameSchema } from "../fields/firstName.schema";
import { departmentIdSchema } from "../fields/departmentId.schema";
import { DepartmentModel } from "../../models/department.model";
import { Types } from "mongoose";
   
export const importEmployeeSchema = z
  .object({
    surname: surnameSchema,
    firstName: firstNameSchema,
    dateOfBirth: dateOfBirthSchema,
    hireDate: hireDateSchema,
    email: emailSchema,
    phoneNumber: phoneNumberSchema,
    departmentId: departmentIdSchema.nullable().optional(),
  })
  .superRefine(async (data, ctx) => {
    if (data.departmentId && Types.ObjectId.isValid(data.departmentId)) {
      const exists = await DepartmentModel.exists({ _id: data.departmentId });
      if (!exists) {
        ctx.addIssue({
          path: ["departmentId"],
          code: "custom",
          message: "Department does not exist in database",
        });
      }
    }
  });