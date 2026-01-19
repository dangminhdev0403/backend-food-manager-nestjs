import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ChangePassBodyDTO } from 'src/routes/profile/profile.dto';
import { UserService } from 'src/routes/users/user.service';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';

dayjs.extend(utc);
dayjs.extend(timezone);
@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userService.findUserByIdOrThrow(userId, {
      name: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    });

    return user;
  }

  async changePassword(userId: number, data: ChangePassBodyDTO) {
    const { oldPassword, newPassword, refreshToken } = data;

    //? Chạy song song I/O queries
    /*
     * Lấy user gồm password + passwordChangedAt để so sánh thời điểm tạo token.
     *Kiểm tra RefreshToken hợp lệ trong DB ngay từ đầu.
     *Phải Đúng 2 case trên mới tiếp tục , sai thì throw 403 hoặc 401
     */
    const [user, refreshTokenDb] = await Promise.all([
      this.userService.findUserByIdOrThrow(userId, { password: true, passwordVersions: true }),
      this.tokenService.validateRefreshTokenOrThrow(refreshToken),
    ]);
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);

    const passVersionDb = user.passwordVersions || 0;
    const passVersionToken = (await decoded).ver || 0;

    if (passVersionDb !== passVersionToken) {
      throw new UnauthorizedException('Refresh token đã bị vô hiệu do mật khẩu thay đổi');
    }

    //? Kiểm tra refresh token có thuộc về user này không (avoid token swap attack)
    if (refreshTokenDb.User.id !== userId) {
      throw new UnauthorizedException('Refresh token không thuộc về người dùng này');
    }

    //? Kiểm tra mật khẩu cũ
    const isMatch = await this.hashingService.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException({ error: 'Mật khẩu cũ không chính xác', message: 'Old password is incorrect' });
    }

    //? Hash mật khẩu mới
    const hashedNewPassword = await this.hashingService.hash(newPassword);
    console.log('updateUser data:', data);

    //! Update mật khẩu + update RefreshToken
    // Transaction bảo vệ update + rotate token
    return await this.prisma.$transaction(async () => {
      //! cột passwordChangedAt phải được cập nhật sau khi đổi pass
      await this.userService.updateUser({ password: hashedNewPassword }, userId);
      const tokens = await this.tokenService.rotateRefreshToken(
        { userId, passwordVersion: passVersionDb + 1 },
        refreshToken,
        refreshTokenDb,
      );

      return {
        message: 'Thay đổi mật khẩu thành công',
        tokens,
      };
    });
  }
}
