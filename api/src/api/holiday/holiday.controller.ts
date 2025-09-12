import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BaseQuery, BaseService } from 'src/common';
import { NAME } from 'src/constants';
import { HolidayDocument, HolidayModel } from 'src/models';
import { CreateHolidayDto } from './holiday.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/user.enums';

@Controller('api/holidays')
@Injectable()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(NAME.JWT)
export class HolidayController extends BaseService<HolidayDocument> {
  constructor(
    @InjectModel(HolidayModel.name)
    private readonly holidayModel: Model<HolidayDocument>,
  ) {
    super(holidayModel);
  }

  @Get()
  get(@Query() qr: BaseQuery) {
    return this.findAll({ page: qr.page, limit: qr.limit, sort: qr.sort });
  }

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  post(@Body() body: CreateHolidayDto) {
    return this.create({
      ...body,
      monthDay: HolidayModel.toMonthDayUTC(body.date),
    });
  }

  @Put(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  put(@Param('id') id: string, @Body() body: CreateHolidayDto) {
    return this.update(id, {
      ...body,
      monthDay: HolidayModel.toMonthDayUTC(body.date),
    });
  }

  @Delete(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.SUPERVISOR)
  destroy(@Param('id') id: string) {
    return this.delete(id);
  }
}
