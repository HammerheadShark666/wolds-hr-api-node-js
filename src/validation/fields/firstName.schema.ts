import z from "zod";

export const firstNameSchema = z
                            .string()
                            .trim()  
                            .max(25, 'First name must be at most 25 characters long');