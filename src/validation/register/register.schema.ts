import { z } from "zod";
import { UserModel } from "../../models/user.model";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .max(250, 'Username must be at most 250 characters long')
    .email('Invalid email format'), 
  password: z
    .string()
    .trim(),
  confirmPassword: z.string().trim(),
}).superRefine(async (data, ctx) => {

  const pwd = data.password;

  if (!pwd) {
    ctx.addIssue({
      path: ['password'],
      code: 'custom',
      message: 'Password is required',
    });
    return;
  }

  if (pwd.length < 8) {
    ctx.addIssue({
      path: ['password'],
      code: 'custom',
      minimum: 8,
      type: 'string',
      inclusive: true,
      message: 'Password must be at least 8 characters long',
    });
  }
  if (pwd.length > 30) {
    ctx.addIssue({
      path: ['password'],
      code: 'custom',
      maximum: 30,
      type: 'string',
      inclusive: true,
      message: 'Password must be at most 30 characters long',
    });
  }
  if (!/[a-z]/.test(pwd)) {
    ctx.addIssue({
      path: ['password'],
      code: 'custom',
      message: 'Password must contain at least one lowercase letter',
    });
  }
  if (!/[A-Z]/.test(pwd)) {
    ctx.addIssue({
      path: ['password'],
      code: 'custom',
      message: 'Password must contain at least one uppercase letter',
    });
  }
  if (!/[0-9]/.test(pwd)) {
    ctx.addIssue({
      path: ['password'],
      code: 'custom',
      message: 'Password must contain at least one number',
    });
  }
  if (!/[^a-zA-Z0-9]/.test(pwd)) {
    ctx.addIssue({
      path: ['password'],
      code: 'custom',
      message: 'Password must contain at least one special character',
    });
  } 

  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      code: 'custom',
      message: "Passwords do not match",
    });
  }

  const user = await UserModel.findOne({ username: data.username })
  if (user) {
      ctx.addIssue({
      path: ['username'],
      code: 'custom',
      message: 'Username already exists',
      });   
  } 
}); 