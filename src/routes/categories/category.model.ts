import { CategoryCreateInputObjectZodSchema } from 'generated/zod-validator/schemas';

const BaseCategorySchema = CategoryCreateInputObjectZodSchema.pick({
   
    
});

export const CategoryCreateSchema = BaseCategorySchema