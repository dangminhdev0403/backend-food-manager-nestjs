import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrder(tableId: number, guestName: string) {
    return this.prismaService.$transaction(async (tx) => {
      const table = await tx.table.findUnique({
        where: {
          id: tableId,
          isActive: true,
        },
      });
      if (!table?.isActive) {
        throw new NotFoundException('TABLE_NOT_FOUND');
      }

      if (table.status !== 'EMPTY') {
        return null;
      }
      // 2. Update table status FIRST
      await tx.table.update({
        where: { id: tableId },
        data: {
          status: 'OCCUPIED',
        },
      });

      // 3. Create order
      return tx.order.create({
        data: {
          guestName,
          tableId,
          status: 'PENDING',
          source: 'GUEST_QR',
        },
        select: {
          id: true,
          guestName: true,
          status: true,
          total: true,
        },
      });
    });
  }

  async addItems(orderId: number, items: { productId: number; quantity: number }[], code: string) {
    let orderItem;
    console.log(code);

    return this.prismaService.$transaction(async (tx) => {
      // 1. Check order
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: { status: true },
      });

      if (!order) throw new NotFoundException('ORDER_NOT_FOUND');
      if (order.status !== 'PENDING') {
        throw new BadRequestException('ORDER_LOCKED');
      }

      // 2. Load all products (1 query)
      const productIds = items.map((i) => i.productId);

      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: {
          basePrice: true,
          ProductTranslation: true,
          id: true,
        },
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('PRODUCT_NOT_FOUND');
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      // 3. Upsert từng item
      for (const item of items) {
        const product = productMap.get(item.productId)!;
        const existing = await tx.orderItem.findFirst({
          where: {
            orderId,
            productId: item.productId,
          },
        });
        if (existing) {
          orderItem = await tx.orderItem.update({
            where: { id: existing.id },
            data: {
              quantity: existing.quantity + item.quantity,
            },
            select: {
              id: true,
              orderItemTranslations: {
                where: {
                  Language: {
                    code,
                  },
                },
                select: {
                  name: true,
                  description: true,
                },
              },
              price: true,
              quantity: true,
            },
          });
        } else {
          orderItem = await tx.orderItem.create({
            data: {
              orderId,
              productId: product.id,
              price: product.basePrice,
              quantity: item.quantity,
              orderItemTranslations: {
                create: product.ProductTranslation.map((t) => ({
                  name: t.name,
                  description: t.description,
                  languageId: t.languageId,
                  cookingInstructions: t.cookingInstructions,
                })),
              },
            },
            select: {
              id: true,
              orderItemTranslations: {
                where: {
                  Language: {
                    code,
                  },
                },
                select: {
                  name: true,
                  description: true,
                },
              },
              price: true,
              quantity: true,
            },
          });
        }
      }

      // 4. Recalc total (ONCE)
      const total = await this.recalcTotal(orderId, tx);
      return {
        orderId,
        status: order.status,
        items: orderItem,
        total,
      };
    });
  }
  async recalcTotal(orderId: number, tx: Prisma.TransactionClient) {
    const items = await tx.orderItem.findMany({
      where: { orderId },
      select: {
        price: true,
        quantity: true,
      },
    });

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await tx.order.update({
      where: { id: orderId },
      data: { total },
    });
    return total;
  }
}
