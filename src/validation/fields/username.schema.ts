import z from "zod";

export const usernameSchema = z
                            .string()
                            .trim()  
                            .max(250, 'Username must be at most 250 characters long')
                            .email('Invalid username format');