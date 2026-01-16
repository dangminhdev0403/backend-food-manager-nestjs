import { Logger } from '@nestjs/common';
import { envConfig } from 'src/shared/config';
import { RoleName } from 'src/shared/constants/role.constant';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();
const hashingService = new HashingService();

const main = async () => {
  const roleCount = await prisma.role.count();
  if (roleCount > 0) {
    throw new Error('Roles already exist in the database. Initialization aborted.');
  }
  Logger.log('====Creating Seed Data======');

  const roles = await prisma.role.createMany({
    data: [
      {
        name: RoleName.Admin,
        description: 'Administrator with full access',
      },
      {
        name: RoleName.Client,
        description: 'Client user with limited access',
      },
      {
        name: RoleName.Seller,
        description: 'Seller user with sales access',
      },
    ],
  });
  const hasshedPass = await hashingService.hash(envConfig.ADMIN_PASSWORD);
  const adminRole = await prisma.role.findFirstOrThrow({
    where: { name: RoleName.Admin },
  });
  Logger.log('====Data Admin Role created======');
  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      password: hasshedPass,
      name: 'Admin User',
      phoneNumber: envConfig.ADMIN_PHONE,
      roleId: adminRole.id,
    },
  });
  Logger.log('====Data Admin User created======');

  return {
    createdRoleCount: roles.count,
    adminUser,
  };
};

main()
  .then((result) => {
    console.log('Initialization completed successfully:', result);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Initialization failed:', error);
    process.exit(1);
  });
