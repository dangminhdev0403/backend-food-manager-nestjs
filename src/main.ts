import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Server } from 'node:http';
import { AddressInfo } from 'node:net';
import * as os from 'node:os';
import { JwtAuthGuard } from 'src/routes/auth/passport/guard/jwt-auth.guard';
import { envConfig } from 'src/shared/config/env.config';
import { SwaggerConfig } from 'src/shared/config/swagger.config';
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

  if (SwaggerConfig.enable(app)) {
    const document = SwaggerConfig.createDocument(app);
    SwaggerConfig.setup(app, document);

    app.use('/swagger-json', (req, res) => res.json(document));
  }

  app.enableCors({
    origin: ['http://192.168.1.11:3000', 'http://localhost:3000', 'http://192.168.1.16:3000', envConfig.PUBLIC_FONTENT_URL, envConfig.PUBLIC_MOBILE_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-table-session'],
  });
  // Global Guard: JwtAuthGuard
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformationInterceptor(reflector));
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const port = Number.parseInt(envConfig.PORT ?? '3000');
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
