import z from "zod";

export const roleSchema = z.enum(['admin', 'clerk']).optional()