import z from "zod";

// export const emailSchema = z.string()
//                             .trim() 
//                             .max(250, 'Email must be at most 250 characters long')
//                             .email('Invalid email format')
//                             .nullable().optional();
                            

// export const emailSchema = z.preprocess(
//   (val) => (typeof val === "string" && val.trim() === "" ? null : val),
//   z
//     .union([
//       z.null(),
//       z
//         .string()
//         .trim()
//         .max(250, 'Email must be at most 250 characters long')
//         .email('Invalid email format'),
//     ])
// );

export const emailSchema = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z.string()
    .trim()
    .max(250, 'Email must be at most 250 characters long')
    .email('Invalid email format')
    .nullable() // allow null (empty string)
);