import { RoleCreateInputObjectZodSchema } from 'generated/zod-validator/schemas';
import z from 'zod';


export const RoleCreateSchema = RoleCreateInputObjectZodSchema.pick({
  name: true,
  description: true,
}).extend({
  permissionIds: z.array(z.number().int()).min(1),
});
