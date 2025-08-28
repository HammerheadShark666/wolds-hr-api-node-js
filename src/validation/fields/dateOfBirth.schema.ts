import z from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const dateOfBirthSchema = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z
    .string()
    .refine((val) => dateRegex.test(val), { message: "Date of birth must be in YYYY-MM-DD format" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date of birth value" })
    .transform((val) => new Date(val))
    .refine((date) => date >= new Date("1950-01-01"), {
      message: "Date of birth must be after Jan 1, 1950",
    })
    .refine((date) => date <= new Date("2007-01-01"), {
      message: "Date of birth cannot be after Jan 1, 2007",
    })
    .nullable()
);