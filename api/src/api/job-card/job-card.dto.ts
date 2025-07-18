import { ApiProperty } from '@nestjs/swagger';
import { BaseQuery } from 'src/common';

export class JobCardQr extends BaseQuery {}
export class JobCardCreate {
  @ApiProperty()
  card_num: string;

  @ApiProperty()
  wo: string;

  @ApiProperty()
  vehicle: string;

  @ApiProperty()
  platform: string;

  @ApiProperty({ default: true })
  is_active: boolean;
}
