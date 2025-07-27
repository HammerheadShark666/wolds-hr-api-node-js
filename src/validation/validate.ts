import { ZodSchema } from "zod";

type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string[] };

export async function validate<T>(
  schema: ZodSchema<T>,
  data: unknown
): Promise<ServiceResult<T>> {
  const parsed = await schema.safeParseAsync(data);

  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => issue.message);
    return { success: false, error: errors };
  }

  return { success: true, data: parsed.data };
}
