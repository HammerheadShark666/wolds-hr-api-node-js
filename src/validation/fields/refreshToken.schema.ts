import z from "zod";

export const refreshTokenSchema = z
                            .string()
                            .trim()  
                            .min(25, 'refresh token invalid length')
                            .max(200, 'refresh token invalid length');