import {
  ProductCreateInputObjectZodSchema,
  ProductTranslationCreateInputObjectZodSchema,
} from 'generated/zod-validator/schemas';
import z from 'zod';

export const BaseProductTranslationSchema = ProductTranslationCreateInputObjectZodSchema.pick({
  name: true,
  description: true,
  cookingInstructions: true,
}).extend({
  languageId: z.number().int().positive(),
});

const ProductBaseSchema = ProductCreateInputObjectZodSchema.pick({
  basePrice: true,
  virtualPrice: true,
})
  .extend({
    categoryId: z.number().int().positive(),
    translations: z.array(BaseProductTranslationSchema).min(1),
  })

  .strict();

export const ProductCreateBodySchema = ProductBaseSchema.extend({
  cookingInstructions: z.string(),
})
  .superRefine((data, ctx) => {
    if (data.basePrice == null) {
      ctx.addIssue({
        code: 'custom',
        path: ['basePrice'],
        message: 'basePrice không được để trống',
      });
      return;
    }

    if (data.virtualPrice != null && data.virtualPrice < data.basePrice) {
      ctx.addIssue({
        code: 'custom',
        path: ['virtualPrice'],
        message: 'Giá niêm yết phải lớn hơn hoặc bằng giá bán',
      });
    }
  })
  .transform((data) => ({
    ...data,
    virtualPrice: data.virtualPrice ?? data.basePrice,
  }));

export const ProductUpdateBodySchema = ProductBaseSchema.partial()
  .extend({
    cookingInstructions: z.string().optional(),

    id: z.number().int().positive(),
  })
  .superRefine((data, ctx) => {
    if (data.basePrice == null || data.virtualPrice == null) {
      return;
    }

    if (data.virtualPrice < data.basePrice) {
      ctx.addIssue({
        code: 'custom',
        path: ['virtualPrice'],
        message: 'Giá niêm yết phải lớn hơn hoặc bằng giá bán',
      });
    }
  })
  .strict();
