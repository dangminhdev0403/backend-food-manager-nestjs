import { Body, Controller, Get, HttpCode, Logger, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChooseItemsOrderBodyDto, OrderGuestCreateBodyDto } from 'src/routes/orders/order.dto';
import { OrderService } from 'src/routes/orders/order.service';
import { RequestGuest } from 'src/shared/constants/auth.constant';
import { TableSessionGuard } from 'src/shared/guard/table-session.guard';

@ApiTags('Guest gọi món')
@Controller('guest/orders')
@UseGuards(TableSessionGuard)
export class GuestOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary: 'Khách điền tên vào bàn',
    description: 'Tạo TableSession và trả token cho khách',
  })
  async createTableSession(@Body() createOrderDto: OrderGuestCreateBodyDto) {
    return this.orderService.createForGuest(createOrderDto);
  }

  @Post('choose-items')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Khách chọn món',
    description: 'Khách chọn món ',
  })
  async chooseItems(@Body() dto: ChooseItemsOrderBodyDto, @Request() req: RequestGuest) {
    return this.orderService.chooseItems(dto, req.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Khách xem chi tiết đơn hàng',
    description: 'Khách xem chi tiết đơn hàng ',
  })
  getOrder(@Request() req: RequestGuest) {
    return this.orderService.getGuestOrder(req.id);
  }
}
