import { Logger } from '@nestjs/common';
import { initialPermission, initialRole } from 'initialScript/initial-system';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();
const hashingService = new HashingService();

const main = async () => {
  Logger.log('Initializing Roles...');
  await initialRole(prisma, hashingService);
  Logger.log('Initializing Permissions...');
  await initialPermission(prisma);

  return 'Initialization completed successfully';
};

main()
  .then((result) => {
    Logger.log(result);
    process.exit(0);
  })
  .catch((error) => {
    Logger.error('Initialization failed:', error);
    process.exit(1);
  });
