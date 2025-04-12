import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserFingerService } from './user-finger.service';

@Controller('api/finger')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserFingerController {
  constructor(private readonly userFingerService: UserFingerService) {}
}
