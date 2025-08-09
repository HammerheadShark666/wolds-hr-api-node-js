import z from "zod";

export const hireDateSchema = z.string()
                                .refine((val) => !isNaN(Date.parse(val)), {
                                    message: "Invalid date format",
                                })
                                .transform((val) => new Date(val))
                                .refine((date) => date >= new Date("2020-01-01"), {
                                    message: "Date must be after Jan 1, 2020",
                                })
                                .refine((date) => date <= new Date(), {
                                    message: "Date cannot be in the future",
                                }) 
                                .optional() 
                                .nullable();