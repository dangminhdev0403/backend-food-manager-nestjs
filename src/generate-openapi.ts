import { NestFactory } from '@nestjs/core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { AppModule } from './app.module';
import { SwaggerConfig } from './shared/config/swagger.config';

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });

  try {
    const document = SwaggerConfig.createDocument(app);
    const serializedDocument = `${JSON.stringify(document, null, 2)}\n`;

    const backendOutputPath = resolve(process.cwd(), 'openapi.json');
    writeFileSync(backendOutputPath, serializedDocument, 'utf-8');

    const sharedOutputPath = resolve(process.cwd(), '../shared-docs/API_SPEC.json');
    mkdirSync(dirname(sharedOutputPath), { recursive: true });
    writeFileSync(sharedOutputPath, serializedDocument, 'utf-8');
  } finally {
    await app.close();
  }
}

generateOpenApi().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to generate openapi.json', error);
  process.exit(1);
});
