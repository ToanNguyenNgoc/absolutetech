// src/auth/strategies/local.strategy.ts

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const result = await this.authService.validateUser(username, password);
  
    if (result && result.error === 'USER_NOT_FOUND') {
      throw new UnauthorizedException({
        message: 'Username does not exist',
        errors: [
          { field: 'username', message: 'Username does not exist' },
        ],
      });
    }
  
    if (result && result.error === 'WRONG_PASSWORD') {
      throw new UnauthorizedException({
        message: 'Password is incorrect',
        errors: [
          { field: 'password', message: 'Password is incorrect' },
        ],
      });
    }
  
    if (!result) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        errors: [
          { field: 'username', message: 'Invalid credentials' },
          { field: 'password', message: 'Invalid credentials' },
        ],
      });
    }
  
    return result;
  }
  
}
