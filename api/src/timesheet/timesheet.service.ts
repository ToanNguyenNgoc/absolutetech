/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Timesheet } from './timesheet.schema';
import { TimesheetDetail } from '../timesheet-detail/timesheet-detail.schema';
import { paginate } from 'src/common/pagination.util';
import { UpdateTimesheetDetailsDto } from './dto/update-timesheet-details.dto';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import { Queue } from 'bull';
import { TimesheetDetailSalaryModel, UserSettingSalaryModel } from 'src/models';
import { DaySalaryCheckService } from 'src/shared/day-salary-check/day-salary-check.service';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectQueue(QUEUE_NAME.approve_timesheet_detail_salary)
    private readonly approveTimesheetQueue: Queue<{timesheet_id: any}>,
    @InjectModel(Timesheet.name)
    private timesheetModel: Model<Timesheet>,
    @InjectModel(TimesheetDetail.name)
    private timesheetDetailModel: Model<TimesheetDetail>,
    @InjectModel(UserSettingSalaryModel.name)
    private readonly useSettingSalaryModel: Model<UserSettingSalaryModel>,
    @InjectModel(TimesheetDetailSalaryModel.name)
    private readonly timesheetDetailSalaryModel: Model<TimesheetDetailSalaryModel>,
    private readonly daySalaryCheckService: DaySalaryCheckService,
  ) {}

  async findAllPaginated({ status, jobnumber, page = 1, limit = 10 }) {
    const filter: any = { deletedAt: null };

    if (status) {
      if (Array.isArray(status)) {
        filter.status = { $in: status };
      } else {
        filter.status = status;
      }
    }

    if (jobnumber) filter.jobnumber_id = jobnumber;

    const options = {
      populate: ['jobnumber_id', 'supervisor_id'],
      sort: { createdAt: -1 },
      lean: true,
    };

    const result = await paginate(
      this.timesheetModel,
      page,
      limit,
      filter,
      undefined,
      options,
    );

    const itemsWithDetails = await Promise.all(
      result.list.map(async (item) => {
        const details = await this.timesheetDetailModel
          .find({
            $or: [
              { timesheet: item._id }, // ObjectId
            ],
            deletedAt: null,
          })
          .populate('attendance_id')
          .lean();

        return {
          id: item._id.toString(),
          jobnumber: item.jobnumber_id,
          supervisor: item.supervisor_id,
          status: item.status,
          date_time: item.date_time,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          details: details.map((d) => ({
            id: d._id.toString(),
            attendance: d.attendance, // user info object
            time_in: d.time_in,
            time_out: d.time_out,
            over_time: d.over_time,
            on_rope: d.on_rope,
            in_charge: d.in_charge,
            other: d.other,
            remarks: d.remarks,
            signature_tech: d.signature_tech,
            json_data: d.json_data,
          })),
        };
      }),
    );

    return {
      items: itemsWithDetails,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    };
  }

  async getDetailWithDetails(timesheetId: string) {
    const timesheet = await this.timesheetModel
      .findById(timesheetId)
      .populate('jobnumber')
      .populate('supervisor')
      .populate('office_supervisor')
      .lean();

    if (!timesheet) throw new NotFoundException('Timesheet not found');
    const details = await this.timesheetDetailModel
      .find({
        $or: [
          { timesheet: timesheetId }, // ObjectId
        ],
        deletedAt: null,
      })
      .populate('attendance')
      .lean();

    const {
      jobnumber,
      supervisor,
      office_supervisor,
      ...restTimesheet
    } = timesheet;

    return {
      ...restTimesheet,
      jobnumber: jobnumber,
      supervisor: supervisor,
      office_supervisor: office_supervisor,
      details: details.map((d) => {
        const { _id, attendance, ...restDetail } = d;
        return {
          ...restDetail,
          id: _id.toString(),
          attendance: attendance,
        };
      }),
    };
  }

  async updateTimesheetDetails(
    timesheetId: string,
    body: UpdateTimesheetDetailsDto,
  ) {
    const details = body.details || [];
    const timesheet = await this.timesheetModel.findByIdAndUpdate(timesheetId, {
      office_supervisor: body.office_supervisor ? body.office_supervisor : undefined,
      date_time: body.date_time ? body.date_time : undefined,
    })
    if (!timesheet) {
      throw new NotFoundException('Timesheet not found.');
    }

    if (timesheet.status === 'approve' || timesheet.status === 'close') {
      throw new BadRequestException(
        'Timesheet cannot be edited as it is already closed or signed by the client.',
      );
    }

    // Explicitly define the type of updatedDetails
    const updatedDetails: TimesheetDetail[] = [];

    for (const detailData of details) {
      const { id, ...updateFields } = detailData;

      const existingDetail = await this.timesheetDetailModel.findOne({
        _id: id,
        timesheet: timesheetId,
        deletedAt: null,
      });

      if (!existingDetail) {
        console.warn(
          `TimesheetDetail with ID ${id} not found for Timesheet ${timesheetId}`,
        );
        continue;
      }

      Object.assign(existingDetail, updateFields);
      await existingDetail.save();

      // Now you can safely push into updatedDetails
      updatedDetails.push(existingDetail);
    }

    return this.getDetailWithDetails(timesheetId);
  }

  async approveTimesheet(timesheetId: string) {
    const timesheet = await this.timesheetModel.findById(timesheetId);

    if (!timesheet) {
      throw new NotFoundException('Timesheet not found.');
    }

    if (timesheet.status === 'closed') {
      throw new BadRequestException(
        'Timesheet is already closed and cannot be approve.',
      );
    }

    if (timesheet.status === Timesheet.STATUS.APPROVE) {
      throw new BadRequestException('Timesheet is already approve.');
    }
    timesheet.status = Timesheet.STATUS.APPROVE;
    await timesheet.save();
    await this.approveTimesheetQueue.add({timesheet_id: timesheet._id},{delay: 1000})
    return this.getDetailWithDetails(timesheetId);
  }

  async calculateAndSaveTimesheetDetailSalary(timesheet_id: any) {
    const timesheet = await this.timesheetModel.findById(timesheet_id);
    if(!timesheet) return;
    const timesheetDetails = await this.timesheetDetailModel.aggregate([
      {
        $match: {
          timesheet: new mongoose.Types.ObjectId(timesheet_id),
          time_in: { $exists: true, $ne: null },
          time_out: { $exists: true, $ne: null },
        }
      }
    ]).exec();
    await Promise.all(timesheetDetails.map(async (timesheetDetail) => {
      const over_time = Number(timesheetDetail.over_time || 0);
      const userSettingSalary = await this.useSettingSalaryModel.findOne({user: timesheetDetail.attendance}).lean().exec();
      if(!userSettingSalary) return;
      let total_allowance_salary = 0;
      if(timesheetDetail.on_rope) total_allowance_salary += userSettingSalary.allowance_on_rope;
      if(timesheetDetail.other) total_allowance_salary += userSettingSalary.allowance_others;
      if(timesheetDetail.is_indoor) total_allowance_salary += userSettingSalary.allowance_indoor;
      if(timesheetDetail.is_night_job) total_allowance_salary += userSettingSalary.allowance_night_job;
      const isHolidayOrSunday = await this.daySalaryCheckService.checkHolidayAndSunday(timesheet.date_time);
      let overtime_salary = over_time * userSettingSalary.overtime_1_5;
      if(isHolidayOrSunday) overtime_salary = over_time * userSettingSalary.overtime_2_0;
      await this.timesheetDetailSalaryModel.updateOne(
        {timesheet_detail: timesheetDetail._id},
        {
          $set:{
            jobnumber: timesheet.jobnumber,
            timesheet: timesheet._id,
            total_allowance_salary,
            overtime_salary,
            date_record: timesheet.date_time
          }
        },
        {upsert: true}
      )
      return;
    }))
    return;
  }

  async closeTimesheet(timesheetId: string) {
    const timesheet = await this.timesheetModel.findById(timesheetId);

    if (!timesheet) {
      throw new NotFoundException('Timesheet not found.');
    }

    if (timesheet.status != Timesheet.STATUS.APPROVE) {
      throw new BadRequestException('Timesheet is not approve yet.');
    }

    timesheet.status = Timesheet.STATUS.CLOSED;
    await timesheet.save();
    return this.getDetailWithDetails(timesheetId);
  }

  async reopenTimesheet(timesheetId: string) {
    const timesheet = await this.timesheetModel.findById(timesheetId);

    if (!timesheet) {
      throw new NotFoundException('Timesheet not found.');
    }

    if (timesheet.status == Timesheet.STATUS.CLOSED) {
      timesheet.status = Timesheet.STATUS.REOPEN;
      await timesheet.save();
      return this.getDetailWithDetails(timesheetId);
    }
    throw new BadRequestException('Timesheet is not close yet.');
  }
}
