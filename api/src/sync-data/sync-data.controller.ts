import { Body, Controller, Post } from '@nestjs/common';
import { FetchForTabletDto } from './dto/fetch-for-tablet.dto';
import { SyncDataService } from './sync-data.services';
import { SyncFromDeviceDto } from './dto/sync-from-device.dto';

@Controller('api/synchronization')
export class SyncDataController {
  constructor(private readonly syncDataService: SyncDataService) {}

  @Post('sync-json')
  async fetchForTablet(@Body() data: FetchForTabletDto) {
    return await this.syncDataService.fetchForTablet(data);
  }

  @Post('push-json')
  async syncToServer(@Body() data: SyncFromDeviceDto) {
    return await this.syncDataService.syncFromDevice(data);
  }
}
