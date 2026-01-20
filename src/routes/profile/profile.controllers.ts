import { Body, Controller, Get, Put, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangePassBodyDTO } from 'src/routes/profile/profile.dto';
import { ProfileService } from 'src/routes/profile/profile.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'User: get Profile' })
  async getProfile(@Request() request: RequestLogined) {
    return await this.profileService.getProfile(request.user.id);
  }

  @Put('change-password')
  @ApiOperation({ summary: 'User: Update Pass' })
  async changePassword(@Body() body: ChangePassBodyDTO, @Request() request: RequestLogined) {
    return await this.profileService.changePassword(request.user.id, body);
  }
}
