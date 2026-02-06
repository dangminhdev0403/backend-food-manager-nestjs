import { Injectable } from '@nestjs/common';
import { TableCreateInput } from 'generated/prisma/models';
import { randomUUID } from 'node:crypto';
import { envConfig } from 'src/shared/config/env.config';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class TableRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createQrForTable(tableData: TableCreateInput) {
    return this.prismaService.$transaction(async (tx) => {
      const table = await tx.table.create({
        data: tableData,
      });

      const qr = await tx.tableQRCode.create({
        data: {
          tableId: table.id,
          token: randomUUID(),
        },
      });

      return {
        id: table.id,
        tableName: table.name,
        qrToken: qr.token,
        qrUrl: `${envConfig.PUBLIC_URL}/tables/scan/${qr.token}`,
      };
    });
  }

  async findAll() {
    return this.prismaService.table.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        isActive: true,
        qr: {
          select: { token: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async resolveByQr(token: string) {
    return await this.prismaService.tableQRCode.findUnique({
      where: { token },
      select: {
        table: {
          select: {
            id: true,
            name: true,
            status: true,
            isActive: true,
          },
        },
      },
    });
  }
}
