/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timesheet } from './timesheet.schema';
import { TimesheetDetail } from '../timesheet-detail/timesheet-detail.schema';
import { paginate } from 'src/common/pagination.util';
import { UpdateTimesheetDetailsDto } from './dto/update-timesheet-details.dto';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectModel(Timesheet.name)
    private timesheetModel: Model<Timesheet>,
    @InjectModel(TimesheetDetail.name)
    private timesheetDetailModel: Model<TimesheetDetail>,
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
              { timesheet_id: item._id }, // ObjectId
              { timesheet_id: item._id.toString() }, // string
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
            attendance: d.attendance_id, // user info object
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
      .populate('jobnumber_id')
      .populate('supervisor_id')
      .populate('office_supervisor_id')
      .lean();

    if (!timesheet) throw new NotFoundException('Timesheet not found');
    const details = await this.timesheetDetailModel
      .find({
        $or: [
          { timesheet_id: timesheetId }, // ObjectId
          { timesheet_id: timesheetId.toString() }, // string
        ],
        deletedAt: null,
      })
      .populate('attendance_id')
      .lean();

    const {
      jobnumber_id,
      supervisor_id,
      office_supervisor_id,
      ...restTimesheet
    } = timesheet;

    return {
      ...restTimesheet,
      jobnumber: jobnumber_id,
      supervisor: supervisor_id,
      office_supervisor: office_supervisor_id,
      details: details.map((d) => {
        const { _id, attendance_id, ...restDetail } = d;
        return {
          ...restDetail,
          id: _id.toString(),
          attendance: attendance_id,
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
      office_supervisor_id: body.office_supervisor_id ? body.office_supervisor_id : undefined,
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
        timesheet_id: timesheetId,
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
    return this.getDetailWithDetails(timesheetId);
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
