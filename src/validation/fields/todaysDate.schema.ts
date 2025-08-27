import { z } from "zod";

export const todaysDateSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? null : trimmed;
    }
    return val;
  },
  z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format (expected YYYY-MM-DD)",
    })
    .transform((val) => new Date(val))
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);
      return inputDate.getTime() === today.getTime();
    }, {
      message: "Date must be today",
    })
);
