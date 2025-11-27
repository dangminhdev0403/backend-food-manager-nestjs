/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { envConfig } from 'src/shared/config';

const connectionString = envConfig.DATABASE_URL;

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({ connectionString });

    super({ adapter, log: ['query', 'info', 'warn', 'error'] });
  }
}
