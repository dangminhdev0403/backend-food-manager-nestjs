import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from 'src/routes/orders/order.service';

@ApiTags('User quản lý đơn hàng')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
}
