import { Body, Controller, Get, Post } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
import { EntryLogRawService } from './entry-log-raw.service';
import { AcsEventCondResponse } from './entry-log-raw.enums';

@Controller('api/entry-logs-raw')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class EntryLogRawController {
  constructor(private readonly entryLogRawRawService: EntryLogRawService) {}
  @Get('latest-entry')
  async getLatestEntry() {
    return this.entryLogRawRawService.getLatestEntry();
  }

  @Post('import-data')
  async importListEntry(
    @Body() data: { entryList: AcsEventCondResponse['AcsEvent']['InfoList'][] },
  ) {
    console.log(data);
    return null;
  }
}
