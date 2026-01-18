import { RoleCreateInputObjectZodSchema } from 'generated/zod-validator/schemas';
import z from 'zod';

export const RoleCreateSchema = RoleCreateInputObjectZodSchema.pick({
  name: true,
  description: true,
})
  .extend({
    permissionIds: z.array(z.number().int()).optional(),
  })
  .strict();

export const RoleUpdateSchema = RoleCreateSchema.partial()
  .extend({
    id: z.number(),
    isActive: z.boolean().optional(),
    addPermissionIds: z.array(z.number()).optional(),
    removePermissionIds: z.array(z.number()).optional(),
  })

  .strict();
