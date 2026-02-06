import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrder(tableId: number) {
    return this.prismaService.$transaction(async (tx) => {
      // 1. Lock logic (logic-level lock)
      const table = await tx.table.findUnique({
        where: { id: tableId , isActive:true , status: 'EMPTY'},
        select: { status: true, isActive: true },
      });

      if (table) {
        throw new NotFoundException('TABLE_NOT_FOUND');
      }

    

      // 2. Chiếm bàn
      await tx.table.update({
        where: { id: tableId },
        data: { status: 'OCCUPIED' },
      });

      // 3. Tạo order
      const order = await tx.order.create({
        data: {
          tableId: tableId,
          
        },
        select: {
          id: true,
          status: true,
        },
      });

      return order;
    });
  }
}
