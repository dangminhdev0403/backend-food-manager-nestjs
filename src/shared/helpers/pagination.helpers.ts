// shared/pagination/normalize-pagination.ts

import { PaginationDTOQuery } from 'src/shared/constants/request.constant';

export function normalizePagination(q: PaginationDTOQuery) {
  const page = Math.max(1, q.page ?? 1);
  const size = Math.min(100, Math.max(1, q.size ?? 20));

  return {
    page,
    size,
    skip: (page - 1) * size,
    take: size,
  };
}

import { Prisma } from 'generated/prisma/client';

export async function prismaPaginate<TDelegate, TArgs extends Prisma.Args<TDelegate, 'findMany'>>(
  delegate: TDelegate,
  args: Prisma.SelectSubset<TArgs, Prisma.Args<TDelegate, 'findMany'>>,
  page: number,
  size: number,
): Promise<{
  items: Prisma.Result<TDelegate, TArgs, 'findMany'>;
  meta: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
}> {
  const skip = (page - 1) * size;
  const findArgs = args as Prisma.Args<TDelegate, 'findMany'> & Record<string, any>;

  const [items, totalItems] = await Promise.all([
    (delegate as any).findMany({ ...findArgs, skip, take: size }),
    (delegate as any).count({ where: (findArgs as any).where }),
  ]);

  return {
    items,
    meta: {
      page,
      size,
      totalItems,
      totalPages: Math.ceil(totalItems / size),
    },
  };
}
