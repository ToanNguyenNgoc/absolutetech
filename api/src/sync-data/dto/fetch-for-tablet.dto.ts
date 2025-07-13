import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FetchForTabletDto {
  @MaxLength(255)
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  @ApiProperty()
  device_id: string;

  @IsOptional()
  @ApiProperty()
  timestamp_fetch?: string;
}
