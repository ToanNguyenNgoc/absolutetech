import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserFingerService } from './user-finger.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NAME } from 'src/constants';

@Controller('api/finger')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth(NAME.JWT)
export class UserFingerController {
  constructor(private readonly userFingerService: UserFingerService) {}
}
