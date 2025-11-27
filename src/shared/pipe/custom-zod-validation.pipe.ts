import { UnprocessableEntityException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

const MyZodValidationPipe = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: ZodError) => {
    console.log('Zod validation error:', error.message);
    throw new UnprocessableEntityException({
      message: 'Validation failed',
      errors: error.issues.map(({ path, message }) => ({ path, message })),
    });
  },
}) as any;

export default MyZodValidationPipe;
