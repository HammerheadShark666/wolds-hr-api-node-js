import z from "zod";
  
export const emailSchema = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z.string()
    .trim()
    .max(250, 'Email must be at most 250 characters long')
    .email('Invalid email format')
    .nullable()
);