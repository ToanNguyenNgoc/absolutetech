import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryLogRaw, EntryLogRawSchema } from './entry-log-raw.schema';
import { EntryLogRawController } from './entry-log-raw.controller';
import { EntryLogRawService } from './entry-log-raw.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EntryLogRaw.name, schema: EntryLogRawSchema },
    ]),
    SharedModule,
  ],
  controllers: [EntryLogRawController],
  providers: [EntryLogRawService],
  exports: [EntryLogRawService],
})
export class EntryLogRawModule {}
