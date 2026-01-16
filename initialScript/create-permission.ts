import { NestFactory } from '@nestjs/core';
import { Prisma } from 'generated/prisma/client';
import { HTTPMethod } from 'generated/prisma/enums';
import { AppModule } from 'src/app.module';
import { SwaggerConfig } from 'src/shared/config/swagger.config';
import { PrismaService } from 'src/shared/services/prisma.service';
import { SwaggerService } from 'src/shared/services/swagger.service';

async function run() {
  const app = await NestFactory.create(AppModule);

  const swaggerService = app.get(SwaggerService);
  const prisma = app.get(PrismaService);

  // CREATE SWAGGER DOCUMENT
  const document = SwaggerConfig.createDocument(app);

  // EXTRACT PERMISSIONS
  const permissions = swaggerService.extractPermissions(document);

  const dbPermissions = await prisma.permission.findMany();

  const dbMap = new Map(dbPermissions.map((p) => [`${p.method}-${p.path}`, p]));
  const swaggerMap = new Map(permissions.map((r) => [`${r.method}-${r.path}`, r]));

  // REMOVE OLD PERMISSIONS
  const toDelete = dbPermissions.filter((p) => !swaggerMap.has(`${p.method}-${p.path}`));
  if (toDelete.length > 0) {
    await prisma.permission.deleteMany({
      where: { id: { in: toDelete.map((x) => x.id) } },
    });
  }

  // ADD NEW PERMISSIONS

  const toAdd = permissions
    .filter((r) => !dbMap.has(`${r.method}-${r.path}`))
    .map<Prisma.PermissionCreateManyInput>((p) => ({
      name: p.name,
      // description: p.description,
      path: p.path,
      method: p.method as HTTPMethod,
    }));
  if (toAdd.length > 0) {
    await prisma.permission.createMany({
      data: toAdd,
      skipDuplicates: true,
    });
  }

  console.log(`Sync DONE. Added: ${toAdd.length}, Removed: ${toDelete.length}`);

  await app.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
