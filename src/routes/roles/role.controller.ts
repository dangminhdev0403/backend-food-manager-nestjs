/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesService } from 'src/routes/roles/roles.service';
@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RolesService) {}



    @Post('create')
    @ApiOperation({ summary: 'Role:Create' })
    async createRole() {
        return "";
    }
}
