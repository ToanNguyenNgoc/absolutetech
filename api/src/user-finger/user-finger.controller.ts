import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserFingerService } from './user-finger.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/user.enums';

@Controller('api/finger')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserFingerController {
  constructor(private readonly userFingerService: UserFingerService) {}

  @Post('register-finger')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.ADMIN_SUPPORT)
  async registerFinger(
    @Body()
    data: {
      fingerNo: number;
      employeeNo: string;
    },
  ) {
    return await this.userFingerService.registerFingerHIKVISION(data);
  }
}
