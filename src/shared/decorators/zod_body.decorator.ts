import { SetMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';

export const ZOD_BODY_SCHEMA = 'zod:body';

export const ZodBody = (schema: ZodSchema) => SetMetadata(ZOD_BODY_SCHEMA, schema);
