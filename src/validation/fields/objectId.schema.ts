import { z } from "zod";
import mongoose from "mongoose";  

export const objectIdSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .refine((val) => {
    if (val == null) return true; 
    if (typeof val !== "string") return false; 
    return /^[a-fA-F0-9]{24}$/.test(val);
  }, { message: "Invalid department Id" });