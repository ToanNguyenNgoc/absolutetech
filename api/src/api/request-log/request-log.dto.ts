import { ApiProperty } from '@nestjs/swagger';
import { BaseQuery } from 'src/common';

export class RequestLogQr extends BaseQuery {
  @ApiProperty({ required: false })
  ignore_log: string;
}
