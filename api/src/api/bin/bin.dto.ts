import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { BaseQuery } from 'src/common';

export class BinQr extends BaseQuery {
  @ApiProperty({ required: false })
  cluster: string;

  @ApiProperty({ required: false })
  shelf: string;

  @ApiProperty({ required: false })
  status: string;
}

class BinConfigureItemCreate {
  @ApiProperty()
  @IsOptional()
  _id: string;

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

  @ApiProperty({
    type: [BinConfigureItemCreate],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BinConfigureItemCreate)
  bin_configures: BinConfigureItemCreate[];
}
