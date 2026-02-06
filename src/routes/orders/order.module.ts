import { Module } from '@nestjs/common';
import { AdminOrderController } from 'src/routes/orders/controllers/order-admin.controller';
import { UserOrderController } from 'src/routes/orders/controllers/order-user.controller';
import { OrderRepository } from 'src/routes/orders/order.repository';
import { PermissionModule } from 'src/routes/permissions/permission.module';
import { GuestOrderController } from './controllers/order-guest.controller';
import { OrderService } from './order.service';

@Module({
  imports: [PermissionModule],
  controllers: [GuestOrderController, UserOrderController, AdminOrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
