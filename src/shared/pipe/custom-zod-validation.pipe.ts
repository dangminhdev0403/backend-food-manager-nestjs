import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ZOD_BODY_SCHEMA } from '../decorators/zod_body.decorator';
import { ZodSchema } from 'zod';

@Injectable()
export class MyZodValidationPipe implements PipeTransform {
  constructor(private reflector: Reflector) {}

  transform(value: any, metadata: ArgumentMetadata & { context?: ExecutionContext }) {
    if (metadata.type !== 'body') return value;

    const context = metadata.context as ExecutionContext;
    const target = context.getClass();
    const handler = context.getHandler();

    const schema: ZodSchema | undefined =
      this.reflector.get(ZOD_BODY_SCHEMA, handler) || this.reflector.get(ZOD_BODY_SCHEMA, target);

    if (!schema) return value;

    const result = schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    return result.data;
  }
}
