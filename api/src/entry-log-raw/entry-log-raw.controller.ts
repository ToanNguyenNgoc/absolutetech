import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/user/user.enums';
import { InfoList } from './entry-log-raw.enums';
import { EntryLogRawService } from './entry-log-raw.service';

@Controller('api/entry-logs-raw')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EntryLogRawController {
  constructor(private readonly entryLogRawRawService: EntryLogRawService) {}
  @Get('latest-entry')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.ADMIN_SUPPORT)
  async getLatestEntry() {
    return this.entryLogRawRawService.getLatestEntry();
  }

  @Post('import-data')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.ADMIN_SUPPORT)
  async importListEntry(@Body() data: InfoList[]) {
    return this.entryLogRawRawService.importRawLogList(data);
  }
}
