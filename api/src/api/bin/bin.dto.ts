import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common';

export class BinQr extends BaseQuery {
  @ApiProperty({ required: false })
  cluster: string;

  @ApiProperty({ required: false })
  shelf: string;

  @ApiProperty({ required: false })
  status: string;
}
export class BinCreate {
  @ApiProperty()
  @IsOptional()
  cluster: string;

  @ApiProperty()
  @IsOptional()
  shelf: string;

  @ApiProperty()
  @IsOptional()
  row: number;

  @ApiProperty()
  @IsOptional()
  bin: number;

  @ApiProperty()
  @IsOptional()
  drawer_name: string;

  @ApiProperty()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  spare: string;

  @ApiProperty()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  quantity_oh: number;

  @ApiProperty()
  @IsOptional()
  min: number;

  @ApiProperty()
  @IsOptional()
  max: number;

  @ApiProperty()
  @IsOptional()
  critical: number;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  is_drawer: boolean;

  @ApiProperty()
  @IsOptional()
  is_locked: boolean;

  @ApiProperty()
  @IsOptional()
  is_failed: boolean;

  @ApiProperty()
  @IsOptional()
  is_processing: boolean;

  @ApiProperty()
  @IsOptional()
  is_faulty: boolean;

  @ApiProperty()
  @IsOptional()
  process_time: Date;

  @ApiProperty()
  @IsOptional()
  process_by: string;
}
