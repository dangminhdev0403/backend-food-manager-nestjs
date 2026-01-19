import z from 'zod';

export const ChangePassBodySchema = z
  .object({
    oldPassword: z.string().min(6).max(100),
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    refreshToken: z.string(),
  })
  .strict()
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không giống nhau',
        path: ['confirmPassword'],
      });
    }
  });
