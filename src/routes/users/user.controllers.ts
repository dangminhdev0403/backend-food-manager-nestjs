import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/routes/users/user.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';
import { AuthorizationGuard } from 'src/shared/guard/authorization.guard';
import z from 'zod';

const UserRoleBodySchema = z.object({ roleId: z.number().int() }).strict();
type UserRoleBody = z.infer<typeof UserRoleBodySchema>;

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthorizationGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id/roles')
  @ApiOperation({ summary: 'Lấy vai trò theo người dùng' })
  async getUserRoles(
    @Request() req: RequestLogined,
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.userService.getRolesByUserId(req.user.roleIds, userId);
  }

  @Post(':id/roles')
  @ApiOperation({ summary: 'Gán vai trò cho người dùng' })
  async assignRole(
    @Request() req: RequestLogined,
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: UserRoleBody,
  ) {
    const parsed = UserRoleBodySchema.parse(body);
    return this.userService.assignRoleToUser(req.user.roleIds, userId, parsed.roleId);
  }

  @Delete(':id/roles')
  @HttpCode(200)
  @ApiOperation({ summary: 'Gỡ vai trò khỏi người dùng' })
  async removeRole(
    @Request() req: RequestLogined,
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: UserRoleBody,
  ) {
    const parsed = UserRoleBodySchema.parse(body);
    return this.userService.removeRoleFromUser(req.user.roleIds, userId, parsed.roleId);
  }
}
