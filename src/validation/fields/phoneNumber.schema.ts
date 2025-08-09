import z from "zod";

export const phoneNumberSchema = z.string()
                                  .min(0).max(25, { message: 'Phone number must be less than or equal to 25 characters' })
                                  .nullable()
                                  .optional();