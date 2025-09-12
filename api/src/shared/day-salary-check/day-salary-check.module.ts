/* eslint-disable prettier/prettier */
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HolidayModel, HolidaySchema, NormalWorkingHourModel, NormalWorkingHourSchema } from "src/models";
import { DaySalaryCheckService } from "./day-salary-check.service";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NormalWorkingHourModel.name, schema: NormalWorkingHourSchema },
      { name: HolidayModel.name, schema: HolidaySchema },
    ]),
  ],
  providers: [DaySalaryCheckService],
  exports: [DaySalaryCheckService],
})

export class DaySalaryCheckModule { }