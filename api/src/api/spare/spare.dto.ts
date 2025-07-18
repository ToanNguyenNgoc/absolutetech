import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common';

export class SpareQr extends BaseQuery {}
export class SpareCreate {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  part_no: string;

  @ApiProperty()
  @IsOptional()
  material_no: string;

  @ApiProperty()
  @IsOptional()
  location: any;

  @ApiProperty()
  @IsOptional()
  supplier_email: string;

  @ApiProperty()
  @IsOptional()
  mat_grp: string;

  @ApiProperty()
  @IsOptional()
  cricode: string;

  @ApiProperty()
  @IsOptional()
  jom: string;

  @ApiProperty()
  @IsOptional()
  item_acct: string;

  @ApiProperty()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsOptional()
  has_batch_no: boolean;

  @ApiProperty()
  @IsOptional()
  has_serial_no: boolean;

  @ApiProperty()
  @IsOptional()
  has_charge_time: boolean;

  @ApiProperty()
  @IsOptional()
  has_calibration_due: boolean;

  @ApiProperty()
  @IsOptional()
  has_expiry_date: boolean;

  @ApiProperty()
  @IsOptional()
  has_load_hydrostatic_test_due: boolean;

  @ApiProperty()
  @IsOptional()
  has_verification: boolean;

  @ApiProperty()
  @IsOptional()
  user_access: string;

  @ApiProperty()
  @IsOptional()
  field1: string;

  @ApiProperty()
  @IsOptional()
  field2: string;

  @ApiProperty()
  @IsOptional()
  url: string;

  @ApiProperty()
  @IsOptional()
  imagePreview: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  auditor: string;

  @ApiProperty()
  @IsOptional()
  user_accessing_spares: string;
}
