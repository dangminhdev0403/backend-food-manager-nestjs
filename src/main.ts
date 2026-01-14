import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Server } from 'http';
import { AddressInfo } from 'net';
import * as os from 'os';
import { JwtAuthGuard } from 'src/routes/auth/passport/guard/jwt-auth.guard';
import { GlobalExceptionFilter } from 'src/shared/errors/exception.filter';
import { TransformationInterceptor } from 'src/shared/Interceptors/tramform.interceptor';
import { AppModule } from './app.module';

function getLocalIp(): string {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: ['http://192.168.1.11:3000', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  // Global Guard: JwtAuthGuard
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformationInterceptor(reflector));
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const port = parseInt(process.env.PORT ?? '3000');
  await app.listen(port);
  const server = app.getHttpServer() as Server;
  const address = server.address() as AddressInfo | string;
  const host = typeof address === 'string' ? address : address.address;
  const actualHost = host === '::' || host === '0.0.0.0' ? 'localhost' : host;
  const ip = getLocalIp();
  Logger.log(`🚀 Application is running on: http://${actualHost}:${port}`, 'Bootstrap');
  Logger.log(`🚀 Application is running Lan: http://${ip}:${port}`);
}
bootstrap();
