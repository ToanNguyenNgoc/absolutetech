/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { StatisticController } from './statistic.controller';
import { Timesheet, TimesheetSchema } from 'src/timesheet/timesheet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Timesheet.name, schema: TimesheetSchema },
    ]),
  ],
  controllers:[StatisticController]
})
export class StatisticModule { }
