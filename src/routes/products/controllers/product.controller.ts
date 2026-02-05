import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from 'src/routes/products/product.service';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
import { AuthorizationGuard } from 'src/shared/guard/authorization.guard';

@ApiTags('API sản phẩn ')
@Controller('products')
@UseGuards(AuthorizationGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách món ăn',
    description: 'Lấy danh sách  một món ăn ',
  })
  async getListProduct(@Query() query: PaginationDTOQuery) {
    return this.productService.getListProduct(query);
  }

  @Get('get-one/:id')
  @ApiOperation({
    summary: 'Xoá món ăn',
    description: 'Thực hiện xoá mềm món ăn theo ID.',
  })
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }
}
