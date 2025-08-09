import { z } from "zod";
import { departmentExistsAsync } from "../../services/department.service";

export const departmentExistsSchema = z
  .string()
  .refine(async (id) => {
    if (!id) return true; 
    const exists = await departmentExistsAsync(id);
    return !!exists;
  }, { message: "Invalid or non-existent department ID" });
