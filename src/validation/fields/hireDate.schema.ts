import z from "zod";

// export const hireDateSchema = z.string()

//                                 .refine((val) => !isNaN(Date.parse(val)), {
//                                     message: "Invalid date format",
//                                 })
//                                 .transform((val) => new Date(val))                                 
                              
//                                 .refine((date) => date >= new Date("2000-01-01"), {
//                                     message: "Date must be after Jan 1, 2000",
//                                 })
//                                 .refine((date) => date <= new Date(), {
//                                     message: "Date cannot be in the future",
//                                 });
 
// export const hireDateSchema = z.preprocess(
//   (val) => (typeof val === "string" && val.trim() === "" ? null : val), // Convert empty to null
//   z
//     .union([
//       z.null(),
//       z.string()
//         .refine((val) => !isNaN(Date.parse(val)), {
//           message: "Invalid date format",
//         })
//         .transform((val) => new Date(val))
//         .refine((date) => date >= new Date("2000-01-01"), {
//           message: "Date must be after Jan 1, 2000",
//         })
//         .refine((date) => date <= new Date(), {
//           message: "Date cannot be in the future",
//         }),
//     ])
// );


const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const hireDateSchema = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z
    .string()
    .refine((val) => dateRegex.test(val), { message: "Hire Date must be in YYYY-MM-DD format" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid hire date value" })
    .transform((val) => new Date(val))
   .refine((date) => date >= new Date("2000-01-01"), {
        message: "Hire Date must be after Jan 1, 2000",
    })
    .refine((date) => date <= new Date(), {
        message: "Hire Date cannot be in the future",
    })
    .nullable()
);
