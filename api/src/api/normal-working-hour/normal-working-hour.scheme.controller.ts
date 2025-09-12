/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Injectable, Param, Put, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BaseService } from 'src/common';
import { NAME } from 'src/constants';
import { NormalWorkingHourDocument, NormalWorkingHourModel } from 'src/models';
import { UpdateNormalWorkingHourDto } from './normal-working-hour.dto.controller';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/user.enums';
import { DateUtil } from 'src/utils/date.util';

@Controller('api/normal-working-hours')
@Injectable()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(NAME.JWT)
export class NormalWorkingHourController extends BaseService<NormalWorkingHourDocument> {
  constructor(
    @InjectModel(NormalWorkingHourModel.name)
    private readonly normalWorkingHourModel: Model<NormalWorkingHourDocument>,
  ) {
    super(normalWorkingHourModel);
  }

  @Get()
  async get() {
    const total = await this.normalWorkingHourModel.countDocuments();
    if (total == 0) {
      const weekdays = [
        { weekday: NormalWorkingHourModel.WEEKDAYS.MONDAY, time_start: '08:30', time_end: '17:30', priority: 0, hours: DateUtil.calculateHHmmDuration('08:30', '17:30') },
        { weekday: NormalWorkingHourModel.WEEKDAYS.TUESDAY, time_start: '08:30', time_end: '17:30', priority: 1, hours: DateUtil.calculateHHmmDuration('08:30', '17:30') },
        { weekday: NormalWorkingHourModel.WEEKDAYS.WEDNESDAY, time_start: '08:30', time_end: '17:30', priority: 2, hours: DateUtil.calculateHHmmDuration('08:30', '17:30') },
        { weekday: NormalWorkingHourModel.WEEKDAYS.THURSDAY, time_start: '08:30', time_end: '17:30', priority: 3, hours: DateUtil.calculateHHmmDuration('08:30', '17:30') },
        { weekday: NormalWorkingHourModel.WEEKDAYS.FRIDAY, time_start: '08:30', time_end: '17:30', priority: 4, hours: DateUtil.calculateHHmmDuration('08:30', '17:30') },
        { weekday: NormalWorkingHourModel.WEEKDAYS.SATURDAY, time_start: '08:30', time_end: '13:30', priority: 5, hours: DateUtil.calculateHHmmDuration('08:30', '13:30') },
      ]
      await this.normalWorkingHourModel.create(weekdays);
    }
    return this.findAll({
      sort: 'priority'
    });
  }

  @Put(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  put(@Param('id') id: string, @Body() body: UpdateNormalWorkingHourDto) {
    return this.update(id, {
      ...body,
      hours: (body.time_start && body.time_start) ? DateUtil.calculateHHmmDuration(body.time_start, body.time_end) : undefined
    })
  }
}
