import { RefinementCtx } from "zod";

type Rule<T> = {
  check: (data: T) => boolean;
  path: (keyof T | string)[];
  message: string;
  extra?: Record<string, any>; // for custom metadata (min, max, etc.)
};

export function applyValidationRules<T>(rules: Rule<T>[]) {
  return (data: T, ctx: RefinementCtx) => {
    for (const rule of rules) {
      if (!rule.check(data)) {
        ctx.addIssue({
          path: rule.path,
          code: "custom",
          message: rule.message,
          ...(rule.extra ?? {}),
        });
      }
    }
  };
}