// src/config/swagger.config.ts

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {

    static enable(app: INestApplication): boolean {
  return process.env.NODE_ENV !== 'production'; // tắt UI trong production
} 
  static createDocument(app: INestApplication): OpenAPIObject {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('REST Service')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    return SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
  }

  static setup(app: INestApplication, document: OpenAPIObject): void {
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        docExpansion: 'none',
      },
    });
  }
}
