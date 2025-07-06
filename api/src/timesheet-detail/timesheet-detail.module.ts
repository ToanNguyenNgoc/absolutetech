import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TimesheetDetail,
  TimesheetDetailSchema,
} from './timesheet-detail.schema';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimesheetDetail.name, schema: TimesheetDetailSchema },
    ]),
    SharedModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TimesheetDetailModule {}
