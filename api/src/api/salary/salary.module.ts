/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JobNumber, JobNumberSchema } from "src/job-number/schemas/job-number.schema";
import { TimesheetDetailSalaryModel, TimesheetDetailSalarySchema } from "src/models";
import { SalaryController } from "./salary.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobNumber.name, schema: JobNumberSchema },
      { name: TimesheetDetailSalaryModel.name, schema: TimesheetDetailSalarySchema },
    ])
  ],
  controllers: [SalaryController]
})

export class SalaryModule { }