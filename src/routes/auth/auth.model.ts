import { RefreshTokenCreateInputObjectZodSchema } from 'generated/zod-validator/schemas';
import { TypeOfVerfication, UserStatus } from 'src/shared/constants/auth.constant';
import { UserSchema } from 'src/shared/models/shared-user.model';
import { z } from 'zod';

// =========================
// 1. User DB Schema
// =========================

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
    code: z.string().length(6).optional(),
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

// =========================
// 3. Register Response Schema
// =========================
export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

// =========================
// 4. Update User Schema
// =========================
export const UpdateUserSchema = z
  .object({
    email: z.email().optional(),
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

export const VerifyCationCode = z.object({
  id: z.number().optional(),
  email: z.email(),
  code: z.string().min(1).max(10),
  type: z.enum([TypeOfVerfication.REGISTER, TypeOfVerfication.FORGOT_PASSWORD]),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const SendOTPBodySchema = VerifyCationCode.pick({
  email: true,
  type: true,
});

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
});
export const UserResponseSchema = UserSchema.pick({
  id: true,
  email: true,
  passwordVersions: true
 
}).extend({
  roleIds: z.array(z.number()).optional(),
});

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export const RefreshTokenResSchema = LoginResSchema;

export const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  createAt: z.date(),
  isActive: z.boolean(),
});

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const RefreshTokenSchema = RefreshTokenCreateInputObjectZodSchema.pick({
  token: true,
  //@ts-ignore
  userId: true,
  //@ts-ignore
  deviceId: true,
});

export const LogoutBodySchema = RefreshTokenBodySchema;
// ================== Type =========================================
export type RefreshTokenResType = z.infer<typeof RefreshTokenResSchema>;
export type LoginResType = z.infer<typeof LoginResSchema>;
export type LoginBodyType = z.infer<typeof LoginBodySchema>;
export type DeviceType = z.infer<typeof DeviceSchema>;
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>;

export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>;
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;
export type RegisterResType = z.infer<typeof RegisterResSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
export type RoleType = z.infer<typeof RoleSchema>;
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;
export type VerifyCationCodeType = z.infer<typeof VerifyCationCode>;

export type LogoutBodyType = RegisterBodyType;
