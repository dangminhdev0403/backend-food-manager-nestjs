import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderUsertCreateBodyDto } from 'src/routes/orders/order.dto';
import { OrderService } from 'src/routes/orders/order.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';

@ApiTags('User gọi món')
@Controller('users/orders')
export class UserOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: OrderUsertCreateBodyDto, @Request() req: RequestLogined) {
    return this.orderService.createTable({
      tableId: createOrderDto.tableId,
      guestName: req.user.name,
    });
  }
}
