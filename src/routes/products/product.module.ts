import { Module } from '@nestjs/common';
import { PermissionModule } from 'src/routes/permissions/permission.module';
import { AdminProductController } from 'src/routes/products/controllers/admin-product.controller';
import { ProductController } from 'src/routes/products/controllers/product.controller';
import { ProductService } from 'src/routes/products/product.service';

@Module({
  imports: [PermissionModule],
  controllers: [ProductController, AdminProductController],
  providers: [ProductService],
})
export class ProductModule {}
