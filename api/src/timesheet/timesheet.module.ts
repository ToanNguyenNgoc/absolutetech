import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Timesheet, TimesheetSchema } from './timesheet.schema';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timesheet.name, schema: TimesheetSchema },
    ]),
    SharedModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TimesheetModule {}
