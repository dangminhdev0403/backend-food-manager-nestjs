import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { AddItemsOrderBodyDto, OrderGuestCreateBodyDto } from 'src/routes/orders/order.dto';
import { OrderRepository } from 'src/routes/orders/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async createTable(createOrderDto: OrderGuestCreateBodyDto) {
    const { tableId, guestName } = createOrderDto;
    const order = await this.orderRepository.createOrder(tableId, guestName);
    if (!order || order == null)
      throw new NotFoundException({
        error: this.i18n.t('error.HAS_TAKEN_TABLE', {
          lang: I18nContext.current()?.lang,
        }),
        message: this.i18n.t('error.HAS_TAKEN_TABLE', {
          lang: I18nContext.current()?.lang,
        }),
      });
    return order;
  }

  async addItems(dto: AddItemsOrderBodyDto) {
    const code = I18nContext.current()?.lang as string;

    return this.orderRepository.addItems(dto.orderId, dto.items, code);
  }
}
