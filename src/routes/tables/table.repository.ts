import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { TableCreateInput } from 'generated/prisma/models';
import { randomUUID } from 'node:crypto';
import { TableFilterBodyDTO, TableUpdateBodyDTO } from 'src/routes/tables/table.dto';
import { envConfig } from 'src/shared/config/env.config';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
import { normalizePagination, prismaPaginate } from 'src/shared/helpers/pagination.helpers';
import { PrismaService } from 'src/shared/services/prisma.service';
export type TableStatus = 'EMPTY' | 'OCCUPIED' | 'RESERVED';

export interface OrderedDishDTO {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface TableDTO {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  orderedDishes: OrderedDishDTO[];
}

export interface PaginationMetaDTO {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponseDTO<T> {
  items: T[];
  meta: PaginationMetaDTO;
}

@Injectable()
export class TableRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getTableStatusCounts() {
    const result = await this.prismaService.table.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const formatted = result.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {});

    const total = Object.values(formatted).reduce((sum, val) => sum + val, 0);

    return {
      ALL: total,
      ...formatted,
    };
  }
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
        capacity: table.capacity,
        qrToken: qr.token,
        qrUrl: `${envConfig.PUBLIC_URL}/tables/scan/${qr.token}`,
      };
    });
  }
  async updateTable(tableData: TableUpdateBodyDTO) {
    const { id, name, capacity, status } = tableData;
    // if (status == 'EMPTY') {
    //    await this.prismaService.
    //  }
    return this.prismaService.table.update({
      where: { id },
      data: {
        name,
        capacity,
        status,
      },
    });
  }
  async deleteTable(id: number) {
    return this.prismaService.table.delete({
      where: { id },
    });
  }
  async findAll(
    pageable: PaginationDTOQuery & TableFilterBodyDTO,
    code: string,
  ): Promise<PaginatedResponseDTO<TableDTO>> {
    const { page, size } = normalizePagination(pageable);
    const where: Prisma.TableWhereInput = {
      ...(pageable.search && {
        name: {
          contains: pageable.search,
          mode: 'insensitive',
        },
      }),
    };
    if (pageable.statusFilter != 'ALL') {
      where.status = pageable.statusFilter;
    }

    const args = {
      where,
      select: {
        id: true,
        name: true,
        status: true,
        capacity: true,
        isActive: true,
        qr: {
          select: { token: true },
        },

        orders: {
          select: {
            items: {
              select: {
                id: true,
                orderItemTranslations: {
                  where: {
                    Language: {
                      code,
                    },
                  },
                },
                price: true,
                quantity: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    } satisfies Prisma.TableFindManyArgs;
    const data = await prismaPaginate(this.prismaService.table, args, page, size);
    return this.formatTables(data);
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
  private formatTables(data: any) {
    return {
      items: data.items.map((table: any) => ({
        id: table.id,
        name: table.name,
        capacity: table.capacity,
        status: table.status, // giữ nguyên ENUM DB
        qrToken: table.qr.token,

        orderedDishes: table.orders.flatMap((order: any) =>
          order.items.map((item: any) => ({
            id: String(item.id),
            name: item.orderItemTranslations?.[0]?.name ?? '',
            quantity: item.quantity,
            price: item.price,
          })),
        ),
      })),
      meta: data.meta,
    };
  }
}
