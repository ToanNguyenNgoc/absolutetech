import { Body, Controller, Post } from '@nestjs/common';
import { FetchForTabletDto } from './dto/fetch-for-tablet.dto';
import { SyncDataService } from './sync-data.services';

@Controller('api/synchronization')
export class SyncDataController {
  constructor(private readonly syncDataService: SyncDataService) {}

  @Post('sync-json')
  async fetchForTablet(@Body() fetchForTabletDto: FetchForTabletDto) {
    return await this.syncDataService.fetchForTablet(fetchForTabletDto);
  }
}
