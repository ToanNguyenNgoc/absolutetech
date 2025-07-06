import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SyncDataController } from './sync-data.controller';
import { SyncDataService } from './sync-data.services';

import { User, UserSchema } from 'src/user/user.schema';
import {
  UserFinger,
  UserFingerSchema,
} from 'src/user-finger/user-finger.schema';
import { SyncData, SyncDataSchema } from './sync-data.schema';
import {
  JobNumber,
  JobNumberSchema,
} from 'src/job-number/schemas/job-number.schema';
import { Timesheet, TimesheetSchema } from 'src/timesheet/timesheet.schema';
import {
  TimesheetDetail,
  TimesheetDetailSchema,
} from 'src/timesheet-detail/timesheet-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserFinger.name, schema: UserFingerSchema },
      { name: SyncData.name, schema: SyncDataSchema },
      { name: JobNumber.name, schema: JobNumberSchema },
      { name: Timesheet.name, schema: TimesheetSchema },
      { name: TimesheetDetail.name, schema: TimesheetDetailSchema },
    ]),
  ],
  controllers: [SyncDataController],
  providers: [SyncDataService],
  exports: [SyncDataService],
})
export class SyncDataModule {}
