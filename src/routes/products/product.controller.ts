import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductCreateBodyDTO } from 'src/routes/products/product.dto';
import { ProductService } from 'src/routes/products/product.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';
import { AuthorizationGuard } from 'src/shared/guard/authorization.guard';

@ApiTags('Admin Quản lí sản phẩm')
@Controller('products')
@UseGuards(AuthorizationGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo món ăn',
    description: 'Tạo mới một món ăn ',
  })
  async createProduct(@Body() productInput: ProductCreateBodyDTO, @Request() req: RequestLogined) {
    return this.productService.createProduct(productInput, req.user.id);
  }
}
