import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { SUCCESS_MESSAGE_KEY } from 'src/shared/decorators/success-message.decorator';

export class ResponseData<T> {
  status: number;
  error: T | null;
  message: string;
  data: T;

  constructor(status: number, error: T | null, message: string, data: T) {
    this.status = status;
    this.error = error == null ? null : error;
    this.message = message;
    this.data = data;
  }
}

export interface Response<T> {
  data: T;
}
@Injectable()
export class TransformationInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<{ statusCode: number }>();
    const status: number = response.statusCode;
    const successMessage =
      this.reflector.get<string>(SUCCESS_MESSAGE_KEY, context.getHandler()) || 'Call API thành công';
    return next.handle().pipe(
      map((data: T): ResponseData<T> => {
        return new ResponseData<T>(status, null, successMessage, data);
      }),
    );
  }
}
