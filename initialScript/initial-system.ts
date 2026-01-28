import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { HTTPMethod, Prisma } from 'generated/prisma/client';
import 'reflect-metadata';
import { AppModule } from 'src/app.module';
import { envConfig } from 'src/shared/config/env.config';
import { RoleName } from 'src/shared/constants/role.constant';
import { collectRoutesMetadata, normalizePermissions } from 'src/shared/helpers';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

export async function initialPermission(prisma: PrismaService) {
  const app = await NestFactory.createApplicationContext(AppModule);

  const routes = collectRoutesMetadata(app);
  const permissions = normalizePermissions(routes);
  const dbPermissions = await prisma.permission.findMany();
  const dbMap = new Map(dbPermissions.map((p) => [`${p.method}-${p.path}`, p]));

  const swaggerMap = new Map(permissions.map((r) => [`${r.method}-${r.path}`, r]));

  // ---- REMOVE OLD PERMISSIONS ----

  const toDelete = dbPermissions.filter((p) => !swaggerMap.has(`${p.method}-${p.path}`));

  // ---- ADD NEW PERMISSIONS ----

  const toAdd: Prisma.PermissionCreateManyInput[] = permissions
    .filter((r) => !dbMap.has(`${r.method}-${r.path}`))
    .map((p) => ({
      name: p.name,
      path: p.path,
      method: p.method as HTTPMethod,
      module: p.module,
      description:p.description
    }));
  // ---- EXECUTE DB MUTATIONS ----

  const [deleteResult, addResult] = await prisma.$transaction([
    prisma.permission.deleteMany({
      where: { id: { in: toDelete.map((x) => x.id) } },
    }),
    prisma.permission.createMany({
      data: toAdd,
      skipDuplicates: true,
    }),
  ]);

  Logger.log(`Sync Permissions DONE → Added: ${toAdd.length}, Removed: ${toDelete.length}`);
}
export async function initialRole(prisma: PrismaService, hashingService: HashingService) {
  const roleCount = await prisma.role.count();

  if (roleCount === 0) {
    Logger.log('====Creating Seed Roles=====');

    await prisma.role.createMany({
      data: [
        {
          id: Number.parseInt(envConfig.ADMIN_ID),
          name: RoleName.Admin,
          description: 'Administrator with full access',
          isSystem: true,
        },
        { name: RoleName.Client, description: 'Client user with limited access', isSystem: true },
        { name: RoleName.Seller, description: 'Seller user with sales access', isSystem: true },
      ],
    });
  }

  const adminExists = await prisma.user.findFirst({
    where: {
      userRoles: {
        some: {
          roleId: Number.parseInt(envConfig.ADMIN_ID),
        },
      },
    },
    select: { id: true },
  });

  if (!adminExists) {
    Logger.log('====Creating Admin User=====');

    const hasshedPass = await hashingService.hash(envConfig.ADMIN_PASSWORD);
    const adminRole = await prisma.role.findFirstOrThrow({
      where: { name: RoleName.Admin },
    });

    await prisma.user.create({
      data: {
        email: envConfig.ADMIN_EMAIL,
        password: hasshedPass,
        name: 'Admin User',
        phoneNumber: envConfig.ADMIN_PHONE,
        userRoles: {
          create: { roleId: adminRole.id },
        },
      },
    });
  }
}
