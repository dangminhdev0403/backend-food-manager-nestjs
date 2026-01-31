import { z } from 'zod';

export const CreateCategoryTranslationSchema = z.object({
  languageId: z.number().int().positive(),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
});

export const CreateCategorySchema = z
  .object({
    translations: z.array(CreateCategoryTranslationSchema).min(1, 'Category phải có ít nhất 1 ngôn ngữ'),
  })
  .strict();

export const UpdateCategorySchema = z
  .object({
    categoryId: z.number().int().positive(),
    translations: z
      .array(
        z.object({
          languageId: z.number().int().positive(),
          name: z.string().trim().min(1).max(255).optional(),
          description: z.string().trim().min(1).optional(),
        }),
      )
      .min(1),
  })
  .strict();

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryType = z.infer<typeof UpdateCategorySchema>;
