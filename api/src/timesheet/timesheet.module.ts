/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Timesheet, TimesheetSchema } from './timesheet.schema';
import { TimesheetController } from './timesheet.controller';

import {
  TimesheetDetail,
  TimesheetDetailSchema,
} from '../timesheet-detail/timesheet-detail.schema';
import { TimesheetService } from './timesheet.service';
import {
  NormalWorkingHourModel,
  NormalWorkingHourSchema,
  TimesheetDetailSalaryModel,
  TimesheetDetailSalarySchema,
  UserSettingSalaryModel,
  UserSettingSalarySchema,
} from 'src/models';
import { User, UserSchema } from 'src/user/user.schema';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import { ApproveTimesheetDetailSalaryConsumer } from 'src/consumers/approve-timesheet-detail-salary.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timesheet.name, schema: TimesheetSchema },
      { name: TimesheetDetail.name, schema: TimesheetDetailSchema },
      { name: NormalWorkingHourModel.name, schema: NormalWorkingHourSchema },
      { name: User.name, schema: UserSchema },
      { name: TimesheetDetailSalaryModel.name, schema: TimesheetDetailSalarySchema },
      { name: UserSettingSalaryModel.name, schema: UserSettingSalarySchema }
    ]),
    BullModule.registerQueue({
      name: QUEUE_NAME.approve_timesheet_detail_salary,
    }),
  ],
  controllers: [TimesheetController],
  providers: [TimesheetService, ApproveTimesheetDetailSalaryConsumer],
  exports: [TimesheetService],
})
export class TimesheetModule { }
