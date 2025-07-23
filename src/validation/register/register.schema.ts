// import { z } from "zod";
// import { UserModel } from "../../models/user.model";
// import { uniqueValidator } from "../utils/uniqueValidator";
// import { applyValidationRules } from "../utils/applyValidationRules";

// export const registerSchema = z.object({
//   username: z
//     .string()
//     .trim()
//     .max(250, 'Username must be at most 250 characters long')
//     .email('Invalid email format'), 
//   password: z
//     .string()
//     .trim(),
//   confirmPassword: z.string().trim(),
// }).superRefine(async (data, ctx) => {
 
//   await uniqueValidator(UserModel, 'username', 'Username already exists')(data, ctx); 
 
//   if (!data.password) {
//     ctx.addIssue({
//       path: ['password'],
//       code: 'custom',
//       message: 'Password is required',
//     });
//     return;
//   } 
        
//   applyValidationRules([
//     {
//       check: (d) => d.password.length >= 8,
//       path: ["password"],
//       message: "Password must be at least 8 characters long",
//       extra: { minimum: 8, inclusive: true, type: "string" },
//     },
//     {
//       check: (d) => d.password.length <= 30,
//       path: ["password"],
//       message: "Password must be at most 30 characters long",
//       extra: { maximum: 30, inclusive: true, type: "string" },
//     },
//     {
//       check: (d) => /[a-z]/.test(d.password),
//       path: ["password"],
//       message: "Password must contain at least one lowercase letter",
//     },
//     {
//       check: (d) => /[A-Z]/.test(d.password),
//       path: ["password"],
//       message: "Password must contain at least one uppercase letter",
//     },
//     {
//       check: (d) => /[0-9]/.test(d.password),
//       path: ["password"],
//       message: "Password must contain at least one number",
//     },
//     {
//       check: (d) => /[^a-zA-Z0-9]/.test(d.password),
//       path: ["password"],
//       message: "Password must contain at least one special character",
//     },
//     {
//       check: (d) => d.password === d.confirmPassword,
//       path: ["confirmPassword"],
//       message: "Passwords do not match",
//     },
//   ])(data, ctx);  
// }); 
 
import { UserModel } from "../../models/user.model";
import { baseUserSchema } from "../user/baseUser.schema";
import { uniqueValidator } from "../utils/uniqueValidator";

export const registerSchema = baseUserSchema.superRefine(
  async (data, ctx) => {
    await uniqueValidator(UserModel, 'username', 'Username already exists')(data, ctx);
  }
);
