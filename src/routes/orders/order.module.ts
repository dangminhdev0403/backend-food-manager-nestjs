import { OrderService } from './order.service';
import { OrderController } from './controllers/order.controller';
import { Module } from '@nestjs/common';
import { OrderRepository } from 'src/routes/orders/order.repository';
import { PermissionModule } from 'src/routes/permissions/permission.module';

@Module({
  imports: [PermissionModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
