import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const RegisterBodyShema = z
  .object({
    email: z.email(),
    password: z.string().min(6).max(100),
    name: z.string().min(1).max(500),
    phoneNumber: z.string().min(5).max(50).optional(),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export class RegisterBodyDTO extends createZodDto(RegisterBodyShema) {}
