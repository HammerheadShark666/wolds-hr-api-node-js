import { z } from 'zod';

export const employeeSearchSchema = z
  .object({
    departmentId: z.string().optional(),
    keyword: z.string().optional(),
  })
  .refine(
    (data) => data.departmentId || data.keyword,
    {
      message: 'Either keyword and/or department must be provided'
    }
  );
