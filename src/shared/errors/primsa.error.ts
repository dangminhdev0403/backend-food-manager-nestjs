import { BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export function handleUniqueConstraintError(error: unknown, title: string, message: string): never | void {
  if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new BadRequestException({
      statusCode: 400,
      error: title,
      message: message,
    });
  }
}

export function handleRecordNotFoundError(error: unknown, title: string, message: string): never | void {
  if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
    throw new BadRequestException({
      statusCode: 400,
      error: title,
      message: message,
    });
  }
}
