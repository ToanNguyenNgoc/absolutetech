import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class TimesheetDetailUpdateItemDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  time_in?: string;

  @IsOptional()
  @IsString()
  time_out?: string;

  @IsOptional()
  over_time?: any;

  @IsOptional()
  @IsBoolean()
  on_rope?: boolean;

  @IsOptional()
  @IsBoolean()
  in_charge?: boolean;

  @IsOptional()
  @IsBoolean()
  other?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  is_indoor?: boolean;

  @IsOptional()
  @IsBoolean()
  is_night_job?: boolean;
}

export class UpdateTimesheetDetailsDto {
  @ApiProperty()
  @IsOptional()
  office_supervisor: string;

  @ApiProperty()
  @IsOptional()
  date_time: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimesheetDetailUpdateItemDto)
  details: TimesheetDetailUpdateItemDto[];
}
