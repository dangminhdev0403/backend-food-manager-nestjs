import { LanguageCreateInputObjectZodSchema } from 'generated/zod-validator/schemas';
import z from 'zod';

const LanguageSchema = LanguageCreateInputObjectZodSchema.pick({
  name: true,
  code: true,
});
export const LanguageCreateSchema = LanguageSchema.strict();
export const LanguageUpdateSchema = LanguageSchema.partial().extend({
  id: z.number().int(),
});

export const LanguageDeleteSchema = LanguageUpdateSchema.pick({
  id: true,
}).extend({
  isHard: z.boolean(),
});
