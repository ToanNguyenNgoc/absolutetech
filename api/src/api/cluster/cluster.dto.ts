import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common';

export class ClusterQr extends BaseQuery {}
export class ClusterCreate {
  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  is_rfid: boolean;

  @ApiProperty()
  @IsOptional()
  is_virtual: boolean;

  @ApiProperty()
  @IsOptional()
  name: string;
}
