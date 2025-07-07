import { Body, Controller, Post } from '@nestjs/common';
import { FetchForTabletDto } from './dto/fetch-for-tablet.dto';
import { SyncDataService } from './sync-data.services';
import { SyncFromDeviceDto } from './dto/sync-from-device.dto';
import { QUEUE_NAME } from 'src/constants';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('api/synchronization')
export class SyncDataController {
  constructor(
    private readonly syncDataService: SyncDataService,
    @InjectQueue(QUEUE_NAME.sync_data)
    private readonly syncDataQueue: Queue,
  ) {}

  @Post('sync-json')
  async fetchForTablet(@Body() data: FetchForTabletDto) {
    return this.syncDataQueue.add(data, { delay: 1000 });
    // return await this.syncDataService.fetchForTablet(data);
  }

  @Post('push-json')
  async syncToServer(@Body() data: SyncFromDeviceDto) {
    return await this.syncDataService.syncFromDevice(data);
  }
}
