import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Timesheet, TimesheetSchema } from './timesheet.schema';
import { TimesheetController } from './timesheet.controller';

import {
  TimesheetDetail,
  TimesheetDetailSchema,
} from '../timesheet-detail/timesheet-detail.schema';
import { TimesheetService } from './timesheet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timesheet.name, schema: TimesheetSchema },
      { name: TimesheetDetail.name, schema: TimesheetDetailSchema },
    ]),
  ],
  controllers: [TimesheetController],
  providers: [TimesheetService],
  exports: [TimesheetService],
})
export class TimesheetModule {}
