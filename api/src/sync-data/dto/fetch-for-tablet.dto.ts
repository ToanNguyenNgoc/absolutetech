import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class FetchForTabletDto {
  @MaxLength(255)
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  device_id: string;

  @IsOptional()
  timestamp_fetch?: string;
}
