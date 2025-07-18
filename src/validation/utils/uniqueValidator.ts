import { Model } from "mongoose";

export function uniqueValidator<T extends { [key: string]: any }>(
  model: Model<any>,
  field: keyof T,
  errorMessage?: string
) {
  return async (value: T, ctx: any) => {
    const exists = await model.exists({ [field]: value[field] });
    if (exists) {
      ctx.addIssue({
        path: [field as string],
        code: 'custom',
        message: errorMessage || `${String(field)} must be unique`,
      });
    }
  };
}