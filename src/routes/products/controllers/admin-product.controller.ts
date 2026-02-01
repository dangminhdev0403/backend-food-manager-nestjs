import { Body, Controller, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductCreateBodyDTO, ProductUpdateBodyDTO } from 'src/routes/products/product.dto';
import { ProductService } from 'src/routes/products/product.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';
import { AuthorizationGuard } from 'src/shared/guard/authorization.guard';

@ApiTags('Admin Quản lí sản phẩm')
@Controller('admin/products')
@UseGuards(AuthorizationGuard)
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo món ăn',
    description: 'Tạo mới một món ăn ',
  })
  async createProduct(@Body() productInput: ProductCreateBodyDTO, @Request() req: RequestLogined) {
    return this.productService.createProduct(productInput, req.user.id);
  }
  @Put()
  @ApiOperation({
    summary: 'Cập nhật món ăn',
    description: 'Cập nhật  một món ăn ',
  })
  async updateProduct(@Body() productInput: ProductUpdateBodyDTO, @Request() req: RequestLogined) {
    return this.productService.updateProduct(productInput, req.user.id);
  }
}
