import { createZodDto } from 'nestjs-zod';
import { ProductCreateSchema, ProductUpdateSchema } from 'src/routes/products/product.model';

export class ProductCreateBodyDTO extends createZodDto(ProductCreateSchema) {}
export class ProductUpdateBodyDTO extends createZodDto(ProductUpdateSchema) {}
