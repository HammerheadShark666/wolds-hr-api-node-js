import { z } from 'zod';

export const idSchema = z.string()
                         .nonempty()
                         .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Id');
