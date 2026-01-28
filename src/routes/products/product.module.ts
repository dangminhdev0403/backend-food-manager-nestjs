import { Module } from '@nestjs/common';
import { PermissionModule } from 'src/routes/permissions/permission.module';
import { ProductController } from 'src/routes/products/product.controller';
import { ProductService } from 'src/routes/products/product.service';

@Module({
  imports: [PermissionModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
