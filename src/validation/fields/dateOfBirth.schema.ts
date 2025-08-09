import z from "zod";

export const dateOfBirthSchema = z.string()                
                                  .refine((val) => !isNaN(Date.parse(val)), {
                                    message: "Invalid date format",
                                  })
                                  .transform((val) => new Date(val))
                                  .refine((date) => date >= new Date("1950-01-01"), {
                                    message: "Date must be after Jan 1, 1950",
                                  })
                                  .refine((date) => date <= new Date("2007-01-01"), {
                                    message: "Date cannot be in the future",
                                  })  
                                  .optional()
                                  .nullable();