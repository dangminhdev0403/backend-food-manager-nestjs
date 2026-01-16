import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/services/prisma.service';
import { HTTPMethod } from 'generated/prisma/enums';

async function run() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const prisma = app.get(PrismaService);
  const server = app.getHttpAdapter().getInstance();
  const router = server._router;

  const availableRoutes = router.stack
    .filter((layer) => layer.route)
    .map((layer) => {
      const method = layer.route.stack[0].method.toUpperCase() as keyof typeof HTTPMethod;
      const path = layer.route.path;
      return {
        path,
        method,
        name: `${method} ${path}`,
      };
    });

  const permissionInDb = await prisma.permission.findMany();

  const dbMap = new Map(permissionInDb.map((p) => [`${p.method}-${p.path}`, p]));
  const routeMap = new Map(availableRoutes.map((r) => [`${r.method}-${r.path}`, r]));

  // FIND TO DELETE
  const toDelete = permissionInDb.filter((p) => !routeMap.has(`${p.method}-${p.path}`));

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} permission(s)…`);

    await prisma.permission.deleteMany({
      where: {
        id: { in: toDelete.map((p) => p.id) },
      },
    });
  }

  // FIND TO ADD
  const toAdd = availableRoutes.filter((r) => !dbMap.has(`${r.method}-${r.path}`));

  if (toAdd.length > 0) {
    console.log(`Adding ${toAdd.length} permission(s)…`);

    await prisma.permission.createMany({
      data: toAdd,
      skipDuplicates: true,
    });
  }

  console.log('Sync completed.');
  await app.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
