import { UserStatus } from 'generated/prisma/enums';
import z from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().min(1).max(500),
  password: z.string().min(6).max(500),
  totpSecret: z.string().nullable(),
  phoneNumber: z.string().min(5).max(50).nullable().optional(),
  avatar: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  roleId: z.number(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserType = z.infer<typeof UserSchema>;
