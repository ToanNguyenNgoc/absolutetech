import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncData, SyncDataSchema } from 'src/sync-data/sync-data.schema';
import { SyncDataLogController } from './sync-data-log.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SyncData.name, schema: SyncDataSchema },
    ]),
  ],
  controllers: [SyncDataLogController],
})
export class SyncDataLogModule {}
