import { Controller, Get, Injectable, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NAME } from 'src/constants';
import { Role } from 'src/user/user.enums';

@Controller('api/app-configs')
@Injectable()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(NAME.JWT)
export class AppConfigController {
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN)
  @Get('apps')
  getAll() {
    return {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
      MONGODB_URI: process.env.MONGODB_URI,
    };
  }
}
