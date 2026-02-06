import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddItemsOrderBodyDto, OrderGuestCreateBodyDto } from 'src/routes/orders/order.dto';
import { OrderService } from 'src/routes/orders/order.service';

@ApiTags('Guest gọi món')
@Controller('guest/orders')
export class GuestOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary: 'Khách chọn bàn',
    description: 'Khách hàng điền tên ngồi vào bàn ',
  })
  async createOrder(@Body() createOrderDto: OrderGuestCreateBodyDto) {
    return this.orderService.createTable(createOrderDto);
  }

  @Post('add-items')
  async addItem(@Body() addOrderItemsDto: AddItemsOrderBodyDto) {
    return this.orderService.addItems(addOrderItemsDto);
  }
}
