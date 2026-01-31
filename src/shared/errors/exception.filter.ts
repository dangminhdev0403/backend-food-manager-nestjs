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
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ZodValidationException } from 'nestjs-zod';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { ResponseData } from 'src/shared/constants/response.constant';
import { ZodError } from 'zod';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let error: any = null;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message;

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
          error: this.i18n.t('exceptionHandler.VALIDATION_FAILED', { lang: I18nContext.current()?.lang }),
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
          message = res || this.i18n.t('exceptionHandler.BAD_REQUEST', { lang: I18nContext.current()?.lang });
        }
        break;
      }

      case exception instanceof UnauthorizedException: {
        status = HttpStatus.UNAUTHORIZED;
        const res = exception.getResponse() as any;

        if (typeof res === 'object') {
          return response.status(status).json({
            status,
            error: res.error ?? this.i18n.t('exceptionHandler.UNAUTHORIZED', { lang: I18nContext.current()?.lang }),
            message: res.message ?? this.i18n.t('exceptionHandler.UNAUTHORIZED', { lang: I18nContext.current()?.lang }),
            data: res.data ?? null,
          });
        }

        message = res || this.i18n.t('exceptionHandler.UNAUTHORIZED', { lang: I18nContext.current()?.lang });
        break;
      }

      case exception instanceof NotFoundException: {
        status = HttpStatus.NOT_FOUND;
        message = exception.message || this.i18n.t('exceptionHandler.NOT_FOUND');
        break;
      }
      case exception instanceof Prisma.PrismaClientKnownRequestError: {
        //     cause: {
        //   originalCode: '23505',
        //   originalMessage: 'duplicate key value violates unique constraint "Language_code_key"',
        //   kind: 'UniqueConstraintViolation',
        //   constraint: {
        //     fields: [
        //       'code'
        //     ]
        //   }
        // }
        switch (exception.code) {
          case 'P2002': {
            this.logger.error(exception);
            const fields = getUniqueFields(exception);
            message = `Duplicate value for field: ${fields?.join(', ')}`;
            return response.status(HttpStatus.CONFLICT).json({
              status: 409,
              error: this.i18n.t('prisma.P2002', { lang: I18nContext.current()?.lang }),
              message: message,
            });
          }

          case 'P2003':
            return response.status(HttpStatus.BAD_REQUEST).json({
              status: 400,
              error: this.i18n.t('prisma.P2003', { lang: I18nContext.current()?.lang }),
              message: exception.meta?.field,
            });

          case 'P2025':
            return response.status(HttpStatus.BAD_REQUEST).json({
              status: 400,
              error: this.i18n.t('prisma.P2025', { lang: I18nContext.current()?.lang }),
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
        message = this.i18n.t('exceptionHandler.INTERNAL_SERVER_ERROR', { lang: I18nContext.current()?.lang });
        break;
      }
    }

    Logger.error(`❌ Lỗi: ${message}`, JSON.stringify(exception?.stack), 'ExceptionFilter');
    Logger.debug(`${JSON.stringify(exception.getResponse())}`, 'ExceptionError');
    const responseData = new ResponseData(status, error ?? message, message, null);
    response.status(status).json(responseData);
  }
}

function getUniqueFields(exception: any): string[] {
  return (
    exception?.meta?.target ??
    exception?.meta?.constraint?.fields ??
    exception?.meta?.driverAdapterError?.cause?.constraint?.fields ??
    exception?.cause?.constraint?.fields ??
    []
  );
}
