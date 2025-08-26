import { z } from "zod";
//import mongoose from "mongoose";  

// export const objectIdSchema = z
//   .union([z.string(), z.null(), z.undefined()])
//   .refine((val) => {
//     if (val == null) return true; 
//     if (typeof val !== "string") return false; 
//     return /^[a-fA-F0-9]{24}$/.test(val);
//   }, { message: "Invalid department Id" });


//   export const objectIdSchema = z.preprocess(
//   (val) => {
//     if (typeof val === "string" && val.trim() === "") return null; // empty string → null
//     return val;
//   },
//   z
//     .string()
//     .regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid department Id" })
//     .nullable()
//     .optional()
// );


import { Types } from "mongoose";

export const objectIdSchema = z.preprocess(
  (val) => {
    if (val == null) return null;           // null or undefined
    if (typeof val === "string" && val.trim() === "") return null; // empty string
    return val;
  },
  z.union([
    z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid department Id" }),
    z.instanceof(Types.ObjectId), // allow Mongoose ObjectId
    z.null(),                     // allow null
  ])
);