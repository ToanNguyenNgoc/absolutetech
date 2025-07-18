import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common';
import { VehicleModel } from 'src/models';

export class VehicleQr extends BaseQuery {}
export class VehicleCreate {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  vehicle_num: string;

  @ApiProperty()
  @IsOptional()
  vehicle_type: string;

  @ApiProperty()
  @IsOptional()
  variant: string;

  @ApiProperty()
  @IsOptional()
  unit: string;

  @ApiProperty()
  @IsOptional()
  unit_other: string;

  @ApiProperty()
  @IsOptional()
  mileage_start: string;

  @ApiProperty()
  @IsOptional()
  mileage_end: string;

  @ApiProperty({ default: false })
  @IsOptional()
  t_loan: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  unserviceable: boolean;

  @ApiProperty()
  @IsOptional()
  last_point_servicing: string;

  @ApiProperty()
  @IsOptional()
  schedule_6_months: string;

  @ApiProperty()
  @IsOptional()
  completion_date_6_months: string;

  @ApiProperty()
  @IsOptional()
  schedule_12_months: string;

  @ApiProperty()
  @IsOptional()
  completion_date_12_months: string;

  @ApiProperty()
  @IsOptional()
  schedule_18_months: string;

  @ApiProperty()
  @IsOptional()
  completion_date_18_months: string;

  @ApiProperty()
  @IsOptional()
  schedule_24_months: string;

  @ApiProperty()
  @IsOptional()
  completion_date_24_months: string;

  @ApiProperty({ default: VehicleModel.status_open })
  @IsOptional()
  status: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty()
  @IsOptional()
  tracker_no: string;

  @ApiProperty()
  @IsOptional()
  updated_by: string;

  @ApiProperty()
  @IsOptional()
  created_by: string;
}
