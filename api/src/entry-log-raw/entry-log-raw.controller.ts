import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserService } from 'src/user/user.service';
import { EntryLogRawService } from './entry-log-raw.service';

@Controller('api/entry-logs-raw')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EntryLogRawController {
  constructor(
    private readonly EntryLogRawRawService: EntryLogRawService,
    private readonly userService: UserService,
  ) {}
}
