import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryLog, EntryLogSchema } from './entry-log.schema';
import { EntryLogController } from './entry-log.controller';
import { EntryLogService } from './entry-log.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EntryLog.name, schema: EntryLogSchema }]),
    SharedModule,
  ],
  controllers: [EntryLogController],
  providers: [EntryLogService],
  exports: [EntryLogService],
})
export class EntryLogModule {}
