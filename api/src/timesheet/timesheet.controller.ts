import { Controller, Get, Query, Param, Put, Body } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { UpdateTimesheetDetailsDto } from './dto/update-timesheet-details.dto';

@Controller('api/timesheets')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Get('open')
  async findOpenTimesheets(
    @Query('jobnumber') jobnumber: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.timesheetService.findAllPaginated({
      status: ['done', 'reopen'],
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
      status: ['closed'],
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
  async approveTimesheet(@Param('id') timesheetId: string) {
    return this.timesheetService.approveTimesheet(timesheetId);
  }

  @Put(':id/close')
  async closeTimesheet(@Param('id') timesheetId: string) {
    return this.timesheetService.closeTimesheet(timesheetId);
  }
}
