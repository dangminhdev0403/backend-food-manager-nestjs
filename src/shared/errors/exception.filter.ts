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
import { ZodValidationException } from 'nestjs-zod';
import { ResponseData } from 'src/shared/Interceptors/tramform.interceptor';
import { ZodError } from 'zod';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi chưa xác định';

    switch (true) {
      // 🟦 Xử lý ZodValidationException trước
      case exception instanceof ZodValidationException: {
        status = HttpStatus.BAD_REQUEST;
        const zodError = exception.getZodError() as ZodError;
        if (!zodError) {
          message = 'Invalid request data';
          break;
        }
        const errors = zodError.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));

        Logger.error(`❌ Zod validation error`, JSON.stringify(errors), 'ZodValidationException');

        return response.status(status).json({
          status,
          error: 'Validation error',
          message: errors,
          data: null,
        });
      }

      case exception instanceof BadRequestException: {
        status = HttpStatus.BAD_REQUEST;
        const res = exception.getResponse() as any;

        if (typeof res === 'object') {
          message = res.message ?? res.error ?? 'Yêu cầu không hợp lệ';
        } else {
          message = res || 'Yêu cầu không hợp lệ';
        }
        break;
      }

      case exception instanceof UnauthorizedException: {
        status = HttpStatus.UNAUTHORIZED;
        message = exception.message || 'Không có quyền';
        break;
      }

      case exception instanceof NotFoundException: {
        status = HttpStatus.NOT_FOUND;
        message = exception.message || 'Không tìm thấy';
        break;
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

    Logger.error(`❌ Lỗi: ${message}`, (exception as any)?.stack, 'ExceptionFilter');

    const responseData = new ResponseData(status, message, message, null);
    response.status(status).json(responseData);
  }
}
