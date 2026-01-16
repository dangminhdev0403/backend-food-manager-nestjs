import { Prisma } from 'generated/prisma/client';
import { whitelist } from 'src/shared/constants/auth.constant';

// Predicate to check for unique constraint errors , web check code error : https://www.prisma.io/docs/orm/reference/error-reference
export function isUniqueConstraintError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}
export function isPublicRoute(path: string): boolean {
  return whitelist.some((rule) => {
    if (typeof rule === 'string') return rule === path;
    if (rule instanceof RegExp) return rule.test(path);
    return false;
  });
}
