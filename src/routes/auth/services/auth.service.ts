/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterBodyType } from 'src/routes/auth/auth.model';
import { AuthRepository } from 'src/routes/auth/auth.repository';
import { RolesService } from 'src/routes/auth/services/roles.service';
import { isUniqueConstraintError } from 'src/shared/helpers';
import { HashingService } from 'src/shared/services/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
  ) {}

  async registerUser(body: RegisterBodyType): Promise<Omit<RegisterBodyType, 'password' | 'roleId'>> {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);

      const roleId = await this.rolesService.getClientRoleId();

      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,

        roleId,
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }
}
