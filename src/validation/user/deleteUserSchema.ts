import { z } from 'zod';
import { idSchema } from '../fields/id.schema';
import { UserModel } from '../../models/user.model';

export const deleteUserSchema = z
  .object({
    id: idSchema
  })
  .superRefine(async (data, ctx) => {   
    const existing = await UserModel.findById(data.id); 

    console.log("Existing = ", existing);
    if (!existing) {
        ctx.addIssue({
        path: ['id'],
        code: 'custom',
        message: 'User not found',
        });
    }     
}); 