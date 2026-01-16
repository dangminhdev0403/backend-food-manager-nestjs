import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { randomInt } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

if (!fs.existsSync(path.resolve('.env'))) {
  throw new Error('.env file is missing. Please create one based on .env.example');
}

config({ path: '.env' });

// Định nghĩa schema với Zod
const ConfigSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_PHONE: z.string(),
  OTP_EXPIRES_IN: z.coerce.number(),
  PORT: z.string(),
  NODE_ENV: z.enum(["development","production"])
});
const parseResult = ConfigSchema.safeParse(process.env);
if (!parseResult.success) {
  Logger.error('❌ Invalid environment variables:\n', parseResult.error);
  process.exit(1);
}
export const envConfig = parseResult.data;

export const generateOTP = () => randomInt(100000, 1000000).toString();
