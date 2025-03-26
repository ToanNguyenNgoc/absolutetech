// src/auth/auth.controller.ts

import { Controller, Post, UseGuards, Request, Get, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getInfo(@Request() req) {
    const fullUser: any = await this.userService.findOneByField('_id', req.user.userId);
    const userObj = typeof fullUser.toObject === 'function' ? fullUser.toObject() : fullUser;
    const { password, ...result } = userObj;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.userId;
    const user = await this.userService.findOneByField('_id', userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match',
      );
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.userService.updatePassword(userId, hashedPassword);

    return { message: 'Password changed successfully' };
  }
}
