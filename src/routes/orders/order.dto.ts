import { createZodDto } from 'nestjs-zod';
import { CreateCategorySchema, UpdateCategorySchema } from 'src/routes/categories/category.model';

export class CategoryCreateBodyDto extends createZodDto(CreateCategorySchema) {}
export class CategoryUpdateBodyDto extends createZodDto(UpdateCategorySchema) {}
