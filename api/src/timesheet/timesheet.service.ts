import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timesheet } from './timesheet.schema';
import { TimesheetDetail } from '../timesheet-detail/timesheet-detail.schema';
import { paginate } from 'src/common/pagination.util';
import { Types } from 'mongoose';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectModel(Timesheet.name)
    private timesheetModel: Model<Timesheet>,
    @InjectModel(TimesheetDetail.name)
    private timesheetDetailModel: Model<TimesheetDetail>,
  ) {}

  async findAllPaginated({ status, jobnumber, page = 1, limit = 10 }) {
    const filter: any = { deleted_at: null };
    if (status) filter.status = status;
    if (jobnumber) filter.jobnumber_id = jobnumber;

    const options = {
      populate: ['jobnumber_id', 'supervisor_id'],
      sort: { created_at: -1 },
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
            deleted_at: null,
          })
          .populate('attendance_id')
          .lean();

        return {
          id: item._id.toString(),
          jobnumber: item.jobnumber_id,
          supervisor: item.supervisor_id,
          status: item.status,
          date_time: item.date_time,
          created_at: item.created_at,
          updated_at: item.updated_at,
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
        deleted_at: null,
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
}
