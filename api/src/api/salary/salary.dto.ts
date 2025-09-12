import { ApiProperty } from '@nestjs/swagger';
import { BaseQuery } from 'src/common';

export class SalaryJobnumberQr extends BaseQuery {
  // @ApiProperty({ required: false, description: `Example: ${Object.values(Timesheet.STATUS).join('|')}` })
  // timesheet_status?: string;
}

export class SalaryTimesheetQr extends BaseQuery {
  @ApiProperty({ required: false, description: `ISO string: '2025-07-01'` })
  start_date_record?: string;
  @ApiProperty({ required: false, description: ` ISO string: '2025-07-29'` })
  end_date_record?: string;
}
