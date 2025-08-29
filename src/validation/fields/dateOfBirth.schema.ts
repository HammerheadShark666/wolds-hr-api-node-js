import z from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// export const dateOfBirthSchema = z.preprocess(
//   (val) => (typeof val === "string" && val.trim() === "" ? null : val),
//   z
//     .string()
//     .refine((val) => dateRegex.test(val), { message: "Date of birth must be in YYYY-MM-DD format" })
//     .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date of birth value" })
//     .transform((val) => new Date(val))
//     .refine((date) => date >= new Date("1950-01-01"), {
//       message: "Date of birth must be after Jan 1, 1950",
//     })
//     .refine((date) => date <= new Date("2007-01-01"), {
//       message: "Date of birth cannot be after Jan 1, 2007",
//     })
//     .nullable()
// );
// export const dateOfBirthSchema = z.preprocess(
//   (val) => (typeof val === "string" && val.trim() === "" ? null : val),
//   z
//     .string()
//     .refine((val) => dateRegex.test(val), { message: "Date of birth must be in YYYY-MM-DD format" })
//     .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date of birth value" })
//     .transform((val) => new Date(val))
//     .pipe(
//       z.date()
//         .refine((date) => date >= new Date("1950-01-01"), {
//           message: "Date of birth must be after Jan 1, 1950",
//         })
//         .refine((date) => date <= new Date("2007-01-01"), {
//           message: "Date of birth cannot be after Jan 1, 2007",
//         })
//     )
//     .nullable()
// );

// export const dateOfBirthSchema = z.preprocess(
//   (val) => (typeof val === "string" && val.trim() === "" ? null : val),
//   z
//     .string()
//     .refine((val) => dateRegex.test(val), {
//       message: "Date of birth must be in YYYY-MM-DD format",
//     })
//     .refine((val) => !isNaN(Date.parse(val)), {
//       message: "Invalid date of birth value",
//     })
//     .transform((val) => new Date(val))
//     .superRefine((date, ctx) => {
//       if (!(date instanceof Date) || isNaN(date.getTime())) {
//         ctx.addIssue({
//           code: "custom",
//           message: "Invalid date of birth value",
//         });
//         return;
//       }

//       if (date < new Date("1950-01-01")) {
//         ctx.addIssue({
//           code: "custom",
//           message: "Date of birth must be after Jan 1, 1950",
//         });
//       }

//       if (date > new Date("2007-01-01")) {
//         ctx.addIssue({
//           code: "custom",
//           message: "Date of birth cannot be after Jan 1, 2007",
//         });
//       }
//     })
//     .nullable()
// ); 

export const dateOfBirthSchema = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z
    .string()
    .superRefine((val, ctx) => {
      if (val === null) return;

      // 1. format check
      if (!dateRegex.test(val)) {
        ctx.addIssue({
          code: "custom",
          message: "Date of birth must be in YYYY-MM-DD format",
        });
        return; // stop further checks
      }

      // 2. parse check
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid date of birth value",
        });
        return;
      }

      // 3. range checks
      if (date < new Date("1950-01-01")) {
        ctx.addIssue({
          code: "custom",
          message: "Date of birth must be after Jan 1, 1950",
        });
        return;
      }

      if (date > new Date("2007-01-01")) {
        ctx.addIssue({
          code: "custom",
          message: "Date of birth cannot be after Jan 1, 2007",
        });
        return;
      }
    })
    .nullable()
);
