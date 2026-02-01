import { createZodDto } from 'nestjs-zod';
import { ProductCreateBodySchema, ProductUpdateBodySchema } from 'src/routes/products/product.model';

export class ProductCreateBodyDTO extends createZodDto(ProductCreateBodySchema) {}
export class ProductUpdateBodyDTO extends createZodDto(ProductUpdateBodySchema) {}
