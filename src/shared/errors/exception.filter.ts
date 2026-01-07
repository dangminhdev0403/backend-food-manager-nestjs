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
import { ResponseData } from 'src/shared/Interceptors/tramform.interceptor';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi chưa xác định';

    switch (true) {
      case exception instanceof BadRequestException: {
        status = HttpStatus.BAD_REQUEST;
        const res = exception.getResponse() as { message?: string | string[]; error?: string } | string;
        if (typeof res === 'object' && res !== null) {
          if (Array.isArray(res.message)) {
            message = res.message.join(', ');
          } else {
            message = res.message ?? res.error ?? 'Yêu cầu không hợp lệ';
          }
        } else if (typeof res === 'string') {
          message = res;
        } else {
          message = 'Yêu cầu không hợp lệ';
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
        const res = exception.getResponse() as { message?: string; error?: string } | string;
        message = typeof res === 'string' ? res : (res.message ?? res.error ?? 'Lỗi từ HttpException');
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
