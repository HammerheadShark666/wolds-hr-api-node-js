import { RefinementCtx } from "zod";

type PasswordData = {
  password: string;
  confirmPassword?: string;
};

export function validatePassword(data: PasswordData, ctx: RefinementCtx) {
  const pwd = data.password;
 
  if (!pwd) {
    ctx.addIssue({
      path: ["password"],
      code: "custom",
      message: "Password is required",
    });
    return;
  }

  const rules = [
    {
      check: pwd.length >= 8,
      message: "Password must be at least 8 characters long",
      path: ["password"],
      extra: { minimum: 8, inclusive: true, type: "string" },
    },
    {
      check: pwd.length <= 30,
      message: "Password must be at most 30 characters long",
      path: ["password"],
      extra: { maximum: 30, inclusive: true, type: "string" },
    },
    {
      check: /[a-z]/.test(pwd),
      message: "Password must contain at least one lowercase letter",
      path: ["password"],
    },
    {
      check: /[A-Z]/.test(pwd),
      message: "Password must contain at least one uppercase letter",
      path: ["password"],
    },
    {
      check: /[0-9]/.test(pwd),
      message: "Password must contain at least one number",
      path: ["password"],
    },
    {
      check: /[^a-zA-Z0-9]/.test(pwd),
      message: "Password must contain at least one special character",
      path: ["password"],
    },
  ];

  for (const rule of rules) {
    if (!rule.check) {
      ctx.addIssue({
        code: "custom",
        path: rule.path,
        message: rule.message,
        ...(rule.extra ?? {}),
      });
    }
  } 

  if (
    typeof data.confirmPassword === "string" &&
    data.confirmPassword !== data.password
  ) {
    ctx.addIssue({
      path: ["confirmPassword"],
      code: "custom",
      message: "Passwords do not match",
    });
  }
}