/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Query,
  Param,
  Put,
  Body,
  UseGuards,
  Injectable,
} from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { UpdateTimesheetDetailsDto } from './dto/update-timesheet-details.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/user/user.enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timesheet, TimesheetDocument } from './timesheet.schema';
import { BaseService } from 'src/common';
import { NAME } from 'src/constants';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('api/timesheets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth(NAME.JWT)
@Injectable()
export class TimesheetController extends BaseService<TimesheetDocument> {
  constructor(
    @InjectModel(Timesheet.name)
    private readonly timeSheetModel: Model<TimesheetDocument>,
    private readonly timesheetService: TimesheetService,
  ) {
    super(timeSheetModel);
  }

  @Get('open')
  async findOpenTimesheets(
    @Query('jobnumber') jobnumber: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search,
  ) {
    // return this.timesheetService.findAllPaginated({
    //   status: ['done', 'reopen', 'approve'],
    //   jobnumber,
    //   page,
    //   limit,
    // });
    return this.findOpenTimesheetsWithAggregate(
      page,
      limit,
      search,
      [Timesheet.STATUS.APPROVE, Timesheet.STATUS.DONE, Timesheet.STATUS.OPEN, Timesheet.STATUS.REOPEN]
    )
  }

  @Get('close')
  async findCloseTimesheets(
    @Query('jobnumber') jobnumber: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search
  ) {
    // return this.timesheetService.findAllPaginated({
    //   status: ['close'],
    //   jobnumber,
    //   page,
    //   limit,
    // });
    return this.findOpenTimesheetsWithAggregate(
      page,
      limit,
      search,
      [Timesheet.STATUS.CLOSED]
    )
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.timesheetService.getDetailWithDetails(id);
  }

  @Put(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  async updateTimesheetDetails(
    @Param('id') timesheetId: string,
    @Body() updateDto: UpdateTimesheetDetailsDto,
  ) {
    return this.timesheetService.updateTimesheetDetails(
      timesheetId,
      updateDto,
    );
  }

  @Put(':id/approve')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  async approveTimesheet(@Param('id') timesheetId: string) {
    return this.timesheetService.approveTimesheet(timesheetId);
  }

  @Put(':id/close')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  async closeTimesheet(@Param('id') timesheetId: string) {
    return this.timesheetService.closeTimesheet(timesheetId);
  }

  @Put(':id/reopen')
  @Roles(Role.SUPER_ADMIN)
  async reopenTimesheet(@Param('id') timesheetId: string) {
    return this.timesheetService.reopenTimesheet(timesheetId);
  }

  async findOpenTimesheetsWithAggregate(page = 1, limit = 15, search, status: string[] = []) {
    return this.findWithAggregate({
      page: Number(page),
      limit: Number(limit),
      search: search,
      searchFields: ['jobnumber.code', 'jobnumber.client'],
      pipeline: [
        { $match: { status: { $in: status } } },
        // { $addFields: { jobnumber_id: { $toObjectId: '$jobnumber_id' } } },
        { $lookup: { from: 'jobnumbers', localField: 'jobnumber', foreignField: '_id', as: 'jobnumber' } },
        { $unwind: { path: '$jobnumber', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'users', localField: 'office_supervisor', foreignField: '_id', as: 'office_supervisor' } },
        { $unwind: { path: '$office_supervisor', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'users', localField: 'supervisor', foreignField: '_id', as: 'supervisor' } },
        { $unwind: { path: '$supervisor', preserveNullAndEmptyArrays: true } },
        // { $match: { jobnumber: { $ne: null } } }, //Get item has job number
        {
          $lookup: {
            from: 'timesheet_details',
            let: { timesheetId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$timesheet', '$$timesheetId'] } } },
              { $lookup: { from: 'users', localField: 'attendance', foreignField: '_id', as: 'attendance', } },
              { $unwind: { path: '$attendance', preserveNullAndEmptyArrays: true } },
              { $project: { signature_tech: 0 } }
            ],
            as: 'details',
          },
        },
        { $project: { signature: 0 } }
      ],
      sort: '-createdAt'
    });
  }
}
