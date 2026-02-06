import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from 'src/routes/orders/order.service';

@ApiTags('Admin quản lý đơn hàng')
@Controller('admin/orders')
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}
}
