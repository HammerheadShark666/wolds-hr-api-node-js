import z from "zod";

export const surnameSchema = z
                            .string()
                            .trim()  
                            .max(50, 'Surname must be at most 50 characters long');