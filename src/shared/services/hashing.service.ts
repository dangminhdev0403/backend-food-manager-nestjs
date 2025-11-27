import { Injectable } from '@nestjs/common';
import { compare as bcryptCompare, hash } from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class HashingService {
  // Hash password
  async hash(value: string): Promise<string> {
    return await hash(value, saltRounds);
  }

  // Compare password
  async compare(value: string, hashedValue: string): Promise<boolean> {
    return await bcryptCompare(value, hashedValue);
  }
}
