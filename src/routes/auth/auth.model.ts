import { UserStatus } from 'src/shared/constants/auth.constant';
import { z } from 'zod';

// =========================
// 1. User DB Schema
// =========================
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

// =========================
// 2. Register Body Schema
// =========================
export const RegisterBodySchema = z
  .object({
    email: z.email(),
    name: z.string().min(1).max(500),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100).optional(),
    phoneNumber: z.string().min(5).max(50).nullable().optional(),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

// =========================
// 3. Register Response Schema
// =========================
export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

export type RegisterResType = z.infer<typeof RegisterResSchema>;

// =========================
// 4. Update User Schema
// =========================
export const UpdateUserSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().min(1).max(500).optional(),
    password: z.string().min(6).max(100).optional(),
    confirmPassword: z.string().min(6).max(100).optional(),
    phoneNumber: z.string().min(5).max(50).nullable().optional(),
    avatar: z.string().nullable().optional(),
    status: z.enum(UserStatus).optional(),
    roleId: z.number().optional(),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password && confirmPassword && password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
