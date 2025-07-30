/* eslint-disable prettier/prettier */
import { Controller, Get, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NAME } from 'src/constants';
import { Timesheet, TimesheetDocument } from 'src/timesheet/timesheet.schema';
import { RoleList } from 'src/user/user.enums';
import { User, UserDocument } from 'src/user/user.schema';

@Controller('api/statistic')
@Injectable()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(NAME.JWT)
export class StatisticController {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Timesheet.name)
    private readonly timesheetModel: Model<TimesheetDocument>
  ) { }

  @Get('users')
  async getUsers() {
    const $group = await this.userModel.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: "$role", user_count: { $sum: 1 } } }
    ])
    const list = RoleList.map(i => ({
      ...i,
      user_count: $group.find(item => item._id == i.id)?.user_count || 0
    }))
    return { list };
  }

  @Get('timesheets')
  async getTimesheets() {
    const $group = await this.timesheetModel.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$status', timesheet_count: { $sum: 1 } } }
    ]);
    const list = Object.values(Timesheet.STATUS).map(i => ({
      status:i,
      timesheet_count: $group.find(item => item._id == i)?.timesheet_count || 0
    }));
    return { list }
  }
}
