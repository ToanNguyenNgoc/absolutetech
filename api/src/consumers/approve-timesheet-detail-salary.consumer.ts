import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAME } from 'src/constants';
import { TimesheetService } from 'src/timesheet/timesheet.service';

@Processor(QUEUE_NAME.approve_timesheet_detail_salary)
@Injectable()
export class ApproveTimesheetDetailSalaryConsumer {
  constructor(private readonly timesheetService: TimesheetService) {}
  @Process()
  async handle(job: Job<{ timesheet_id: number }>) {
    return this.timesheetService.calculateAndSaveTimesheetDetailSalary(
      job.data.timesheet_id,
    );
  }
}
