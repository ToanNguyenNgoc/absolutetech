import { Controller, Get, Query, Param, Put, Body, UseGuards } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { UpdateTimesheetDetailsDto } from './dto/update-timesheet-details.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/user/user.enums';

@Controller('api/timesheets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) { }

  @Get('open')
  async findOpenTimesheets(
    @Query('jobnumber') jobnumber: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.timesheetService.findAllPaginated({
      status: ['done', 'reopen', 'approve'],
      jobnumber,
      page,
      limit,
    });
  }

  @Get('close')
  async findCloseTimesheets(
    @Query('jobnumber') jobnumber: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.timesheetService.findAllPaginated({
      status: ['close'],
      jobnumber,
      page,
      limit,
    });
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
      updateDto.details,
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
}
