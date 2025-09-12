import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateHolidayDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  date: Date;
}
