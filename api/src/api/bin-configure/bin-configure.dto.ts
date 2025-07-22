import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common';

export class BinConfigureQr extends BaseQuery {
  @ApiProperty({ required: false })
  bin: string;
}

export class BinConfigureCreate {
  @ApiProperty()
  @IsNotEmpty()
  bin: string;

  @ApiProperty()
  @IsOptional()
  spare: string;

  @ApiProperty()
  @IsOptional()
  critical: number;

  @ApiProperty()
  @IsOptional()
  quantity_org: number;

  @ApiProperty()
  @IsOptional()
  quantity_oh: number;

  @ApiProperty()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  min: number;

  @ApiProperty()
  @IsOptional()
  max: number;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  order: number;

  @ApiProperty()
  @IsOptional()
  batch_no: string;

  @ApiProperty()
  @IsOptional()
  serial_no: string;

  @ApiProperty()
  @IsOptional()
  rfid: string;

  @ApiProperty()
  has_verification: boolean;

  @ApiProperty()
  bar_code_qr_code: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  has_charge_time: boolean;

  @ApiProperty()
  @IsOptional()
  charge_time: Date;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  has_calibration_due: boolean;

  @ApiProperty()
  @IsOptional()
  calibration_due: Date;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  has_expiry_date: boolean;

  @ApiProperty()
  @IsOptional()
  expiry_date: Date;

  @ApiProperty()
  @IsOptional()
  load_hydrostatic_test_due: Date;
}
