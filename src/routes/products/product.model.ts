import { ProductCreateInputObjectZodSchema } from 'generated/zod-validator/schemas';
import z from 'zod';

const ProductBaseSchema = ProductCreateInputObjectZodSchema.pick({
  name: true,
  description: true,
  basePrice: true,
  virtualPrice: true,
});

export const ProductCreateSchema = ProductBaseSchema
  .extend({
    categoryId: z.number({ message: ' categoryId phải là số' }),
  })
  .superRefine((data, ctx) => {
    if (data.basePrice == null) {
      ctx.addIssue({
        code: 'custom',
        message: 'basePrice không được để trống',
        path: ['basePrice'],
      });
    }
    // fallback virtualPrice
    if (data.virtualPrice ?? null) {
      data.virtualPrice = data.basePrice;
    }
    // validate virtualPrice >= basePrice
    if (data.virtualPrice < data.basePrice) {
      ctx.addIssue({
        path: ['virtualPrice'],
        code: 'custom',
        message: 'Giá niêm yết phải lớn hơn hoặc bằng giá bán',
      });
    }
  })
  .strict();

export const ProductUpdateSchema = ProductBaseSchema.partial()
  .extend({
    id: z.number(),
  })
  .strict();
