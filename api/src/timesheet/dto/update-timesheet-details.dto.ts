import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsString()
  over_time?: string;

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
}

export class UpdateTimesheetDetailsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimesheetDetailUpdateItemDto)
  details: TimesheetDetailUpdateItemDto[];
}
