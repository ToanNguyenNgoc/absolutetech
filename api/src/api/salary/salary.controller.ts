/* eslint-disable prettier/prettier */
import { Controller, Get, Injectable, Query, UseGuards } from '@nestjs/common';
import { SalaryJobnumberQr, SalaryTimesheetQr } from './salary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JobNumber } from 'src/job-number/schemas/job-number.schema';
import { Model, PipelineStage } from 'mongoose';
import { paginateWithAggregate } from 'src/common/pagination.util';
import { TimesheetDetailSalaryModel } from 'src/models';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NAME } from 'src/constants';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/user.enums';

@Controller('api/salary')
@Injectable()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(NAME.JWT)
export class SalaryController {
  constructor(
    @InjectModel(JobNumber.name)
    private readonly jobnumberModel: Model<JobNumber>,
    @InjectModel(TimesheetDetailSalaryModel.name)
    private readonly timesheetDetailSalaryModel: Model<TimesheetDetailSalaryModel>,
  ) { }
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  @Get('job-numbers')
  getSalaryJobnumber(@Query() qr: SalaryJobnumberQr) {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'timesheet_detail_salaries', localField: '_id', foreignField: 'jobnumber', as: 'timesheet_detail_salaries',
          pipeline: [
            {
              $lookup: {
                from: 'timesheets', localField: 'timesheet', foreignField: '_id', as: 'timesheet', pipeline: [
                  { $lookup: { from: 'users', localField: 'office_supervisor', foreignField: '_id', as: 'office_supervisor' } },
                  { $unwind: { path: '$office_supervisor', preserveNullAndEmptyArrays: true } },
                  { $project: { signature: 0 } }
                ]
              }
            },
            { $unwind: { path: '$timesheet', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'timesheet_details', localField: 'timesheet_detail', foreignField: '_id', as: 'timesheet_detail', pipeline: [
                  { $lookup: { from: 'users', localField: 'attendance', foreignField: '_id', as: 'attendance' } },
                  { $unwind: { path: '$attendance', preserveNullAndEmptyArrays: true } },
                  { $project: { signature_tech: 0 } }
                ]
              }
            },
            { $unwind: { path: '$timesheet_detail', preserveNullAndEmptyArrays: true } },
          ]
        }
      },
      {
        $match: {
          deletedAt: null,
          timesheet_detail_salaries: { $ne: [] }
        }
      },
    ];
    return paginateWithAggregate({
      model: this.jobnumberModel,
      page: qr.page,
      limit: qr.limit,
      sort: qr.sort,
      pipeline,
    });
  }

  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  @Get('timesheets')
  getSalaryTimesheets(@Query() qr: SalaryTimesheetQr) {
    const pipeline: PipelineStage[] = [
      { $lookup: { from: 'jobnumbers', localField: 'jobnumber', foreignField: '_id', as: 'jobnumber' } },
      { $unwind: { path: '$jobnumber', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'timesheets', localField: 'timesheet', foreignField: '_id', as: 'timesheet', pipeline: [
            { $lookup: { from: 'users', localField: 'office_supervisor', foreignField: '_id', as: 'office_supervisor' } },
            { $unwind: { path: '$office_supervisor', preserveNullAndEmptyArrays: true } },
            { $project: { signature: 0 } }
          ]
        }
      },
      { $unwind: { path: '$timesheet', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'timesheet_details', localField: 'timesheet_detail', foreignField: '_id', as: 'timesheet_detail', pipeline: [
            { $lookup: { from: 'users', localField: 'attendance', foreignField: '_id', as: 'attendance' } },
            { $unwind: { path: '$attendance', preserveNullAndEmptyArrays: true } },
            { $project: { signature_tech: 0 } }
          ]
        }
      },
      { $unwind: { path: '$timesheet_detail', preserveNullAndEmptyArrays: true } },
    ];
    if (qr.start_date_record || qr.end_date_record) {
      const dateFilter: any = {};
      if (qr.start_date_record) {
        dateFilter.$gte = new Date(qr.start_date_record);
      }
      if (qr.end_date_record) {
        const end = new Date(qr.end_date_record);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      pipeline.push({ $match: { date_record: dateFilter } });
    }
    return paginateWithAggregate({
      model: this.timesheetDetailSalaryModel,
      page: qr.page,
      limit: qr.limit,
      sort: qr.sort,
      pipeline,
      search: qr.search,
      searchFields: ['timesheet_detail.attendance.full_name'],
    })
  }
}
