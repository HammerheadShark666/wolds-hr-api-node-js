// import { objectIdSchema } from "./objectId.schema"; 
// export const departmentIdSchema = objectIdSchema;

import { Types } from "mongoose";
import { z } from "zod";
// import { Types } from "mongoose";

export const departmentIdSchema = z.preprocess((val) => {
  if (val == null || (typeof val === "string" && val.trim() === "")) {
    return null;
  }
  return val;
}, z.custom<Types.ObjectId | string | null>((val) => {
  if (val === null) return true;

  if (typeof val === "string") {
    return /^[a-fA-F0-9]{24}$/.test(val); // Must be 24 hex characters
  }

  if (val instanceof Types.ObjectId) return true;

  return false;
}, {
  message: "Invalid department Id"
})).nullable().optional();
