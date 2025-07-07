import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAME } from 'src/constants';
import { SyncDataGateway } from 'src/gateway/sync-data/sync-data.gateway';
import { FetchForTabletDto } from 'src/sync-data/dto/fetch-for-tablet.dto';
import { SyncDataService } from 'src/sync-data/sync-data.services';

@Processor(QUEUE_NAME.sync_data)
@Injectable()
export class SyncDataConsumers {
  constructor(
    private readonly syncDataService: SyncDataService,
    private readonly syncDataGateway: SyncDataGateway,
  ) {}
  @Process()
  async handle(job: Job<FetchForTabletDto>) {
    const result = await this.syncDataService.fetchForTablet(job.data);
    await this.syncDataGateway.sendDataToDevice(job.data.device_id, result);
    return;
  }
}
