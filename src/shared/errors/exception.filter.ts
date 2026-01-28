import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from 'generated/prisma/client';
import { ZodValidationException } from 'nestjs-zod';
import { ResponseData } from 'src/shared/constants/response.constant';
import { ZodError } from 'zod';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let error: any = null;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi chưa xác định';

    switch (true) {
      // 🟦 Xử lý ZodValidationException trước
      case exception instanceof ZodValidationException: {
        status = HttpStatus.BAD_REQUEST;
        const zodError = exception.getZodError() as ZodError;

        const errors = zodError.issues.map((issue) => ({
          field: issue.path.join('.') || 'body',
          message: issue.message,
        }));

        return response.status(status).json({
          status,
          error: 'Dữ liệu không hợp lệ',
          message: errors,
          data: null,
        });
      }

      case exception instanceof BadRequestException: {
        status = HttpStatus.BAD_REQUEST;
        const res = exception.getResponse() as any;
        if (typeof res === 'object') {
          error = res?.error;
          message = res?.message;
        } else {
          message = res || 'Yêu cầu không hợp lệ';
        }
        break;
      }

      case exception instanceof UnauthorizedException: {
        status = HttpStatus.UNAUTHORIZED;
        const res = exception.getResponse() as any;

        if (typeof res === 'object') {
          return response.status(status).json({
            status,
            error: res.error ?? 'Unauthorized',
            message: res.message ?? 'Unauthorized',
            data: res.data ?? null,
          });
        }

        message = res || 'Unauthorized';
        break;
      }

      case exception instanceof NotFoundException: {
        status = HttpStatus.NOT_FOUND;
        message = exception.message || 'Không tìm thấy';
        break;
      }
      case exception instanceof Prisma.PrismaClientKnownRequestError: {
        switch (exception.code) {
          case 'P2002':
            return response.status(HttpStatus.CONFLICT).json({
              status: 409,
              error: 'Unique constraint violated',
              message: exception,
            });

          case 'P2003':
            return response.status(HttpStatus.BAD_REQUEST).json({
              status: 400,
              error: 'Foreign key constraint failed',
              message: exception.meta?.field,
            });

          case 'P2025':
            return response.status(HttpStatus.BAD_REQUEST).json({
              status: 400,
              error: 'Record is invalid',
              message: 'An operation failed because it depends on one or more records that were required but not found',
            });

          default:
            return response.status(500).json({
              status: 500,
              error: 'Prisma error',
              message: exception.message,
            });
        }
      }
      case exception instanceof HttpException: {
        status = exception.getStatus();
        const res = exception.getResponse() as any;
        message = typeof res === 'string' ? res : (res.message ?? res.error);
        break;
      }

      case exception instanceof Error: {
        message = exception.message;
        break;
      }

      default: {
        message = 'Lỗi không xác định';
        break;
      }
    }

    Logger.error(`❌ Lỗi: ${message}`, JSON.stringify(exception?.stack), 'ExceptionFilter');
    Logger.debug(`${JSON.stringify(exception.getResponse())}`, 'ExceptionError');
    const responseData = new ResponseData(status, error ?? message, message, null);
    response.status(status).json(responseData);
  }
}
