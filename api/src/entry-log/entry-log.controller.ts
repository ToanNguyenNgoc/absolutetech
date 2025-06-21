import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { EntryLogService } from './entry-log.service';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/user.enums';
import { convertToCSV } from 'src/common/csv.util';
import { Response } from 'express';

@Controller('api/entry-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EntryLogController {
  constructor(
    private readonly entryLogService: EntryLogService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.TECHNICIAN)
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    let userIds: string[] | undefined = undefined;
    if (search !== undefined && search.trim() !== '') {
      const users: any = await this.userService.findByUsernameOrEmail(search);
      userIds = users.map((u) => u._id);
    }

    return this.entryLogService.findAllPaginated(
      pageNumber,
      limitNumber,
      userIds,
    );
  }
  // @Get('seed')
  // @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.TECHNICIAN)
  // async seedEntryLogs(): Promise<{ message: string }> {
  //   const users: any = await this.userService.findAll();
  //   for (const user of users) {
  //     for (let i = 0; i < 5; i++) {
  //       await this.entryLogService.createFakeLog(user._id);
  //     }
  //   }
  //   return { message: 'Seeding entry logs done' };
  // }

  @Get('export')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_ADMIN, Role.TECHNICIAN)
  async exportEntryLogs(@Query('search') search: string, @Res() res: Response) {
    let entryLogs;
    if (search) {
      const users: any = await this.userService.findByUsernameOrEmail(search);
      const userIds = users.map((u) => u._id);
      console.log(userIds);
      if (userIds.length === 0) {
        entryLogs = [];
      } else {
        entryLogs = await this.entryLogService.findAllByQuery({
          user: { $in: userIds },
        });
      }
    } else {
      entryLogs = await this.entryLogService.findAllNoPaginated();
    }

    const exportData = entryLogs.map((log: any) => {
      const obj = typeof log.toObject === 'function' ? log.toObject() : log;
      const { _id, date, timeIn, timeOut, duration, created_at, user } = obj;
      const userObj =
        user && typeof user.toObject === 'function' ? user.toObject() : user;
      return {
        EntryLogId: _id,
        full_name: userObj?.full_name || '',
        Username: userObj?.username || '',
        employee_id: userObj?.employee_id || '',
        Dept: userObj?.position || '',
        Role: userObj?.role || '',
        Date: date || '',
        TimeIn: timeIn || '',
        TimeOut: timeOut || '',
        Duration: duration || '',
        created_at: created_at || '',
      };
    });

    const csv = convertToCSV(exportData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="entry-logs.csv"',
    );
    res.send(csv);
  }

  // @Get('test')
  // async testCron() {
  //   await this.entryLogService.processDailyLogs();
  //   return { message: 'Cron job executed successfully' };
  // }
}
