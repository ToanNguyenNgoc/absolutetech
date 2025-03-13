// src/auth/auth.controller.ts

import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService,  private userService: UserService) {}

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
}
