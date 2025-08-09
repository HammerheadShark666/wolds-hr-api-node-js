import z from "zod";

export const firstNameSchema = z
                            .string()
                            .trim()  
                            .min(1, 'First name is required')
                            .max(25, 'First name must be at most 25 characters long');