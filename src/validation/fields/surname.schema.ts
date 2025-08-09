import z from "zod";

export const surnameSchema = z
                            .string()
                            .trim()  
                            .min(1, 'Surname is required')
                            .max(25, 'Surname must be at most 25 characters long');