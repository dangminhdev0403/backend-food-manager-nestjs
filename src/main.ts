import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { GlobalExceptionFilter } from 'src/shared/errors/exception.filter';
import { TransformationInterceptor } from 'src/shared/Interceptors/tramform.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  // Global Guard: JwtAuthGuard
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformationInterceptor(reflector));
  const port = parseInt(process.env.PORT ?? '3000');
  await app.listen(port);
  const server = app.getHttpServer() as Server;
  const address = server.address() as AddressInfo | string;
  const host = typeof address === 'string' ? address : address.address;
  const actualHost = host === '::' || host === '0.0.0.0' ? 'localhost' : host;
  Logger.log(`🚀 Application is running on: http://${actualHost}:${port}`, 'Bootstrap');
}
bootstrap();
