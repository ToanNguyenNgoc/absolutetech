import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TimesheetService } from './timesheet.service';

@Controller('api/timesheets')

export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Get()
  async findAllPaginated(
    @Query('status') status: string,
    @Query('jobnumber') jobnumber: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.timesheetService.findAllPaginated({ status, jobnumber, page, limit });
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.timesheetService.getDetailWithDetails(id);
  }
}
