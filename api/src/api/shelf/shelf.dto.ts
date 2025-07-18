import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common';

export class ShelfQr extends BaseQuery {}
export class ShelfCreate {
  @ApiProperty()
  @IsOptional()
  cluster: string;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  num_bins: number;

  @ApiProperty()
  @IsOptional()
  num_rows: number;

  @ApiProperty()
  @IsOptional()
  type: string;
}
