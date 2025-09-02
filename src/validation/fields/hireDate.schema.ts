import z from "zod";
 
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// export const hireDateSchema = z.preprocess(
//   (val) => (typeof val === "string" && val.trim() === "" ? null : val),
//   z
//     .string()
//     .refine((val) => dateRegex.test(val), { message: "Hire Date must be in YYYY-MM-DD format" })
//     .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid hire date value" })
//     .transform((val) => new Date(val))
//    .refine((date) => date >= new Date("2000-01-01"), {
//         message: "Hire Date must be after Jan 1, 2000",
//     })
//     .refine((date) => date <= new Date(), {
//         message: "Hire Date cannot be in the future",
//     })
//     .nullable()
// );


export const hireDateSchema = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z
    .string()
    .superRefine((val, ctx) => {
      if (val === null) return;

      // 1. format check
      if (!dateRegex.test(val)) {
        ctx.addIssue({
          code: "custom",
          message: "Hire date must be in YYYY-MM-DD format",
        });
        return; // stop further checks
      }

      // 2. parse check
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid hire date value",
        });
        return;
      }

      // 3. range checks
      if (date < new Date("2000-01-01")) {
        ctx.addIssue({
          code: "custom",
          message: "Hire date must be after Jan 1, 2000",
        });
        return;
      }

      if (date > new Date()) {
        ctx.addIssue({
          code: "custom",
          message: "Hire date cannot be in future",
        });
        return;
      }
    })
    .nullable()
);