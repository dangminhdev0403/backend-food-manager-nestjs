import { Prisma } from "generated/prisma/client";

// Predicate to check for unique constraint errors , web check code error : https://www.prisma.io/docs/orm/reference/error-reference
export function isUniqueConstraintError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}
