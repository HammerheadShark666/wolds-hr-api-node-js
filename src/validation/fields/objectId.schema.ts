import { z } from "zod"; 
import { Types } from "mongoose";

export const objectIdSchema = z.preprocess(
  (val) => {
    if (val == null) return null;           
    if (typeof val === "string" && val.trim() === "") return null;
    return val;
  },
  z.union([
    z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid Id" }),
    z.instanceof(Types.ObjectId),
    z.null(),                     
  ])
);