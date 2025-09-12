import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateNormalWorkingHourDto {
  @ApiProperty()
  @IsNotEmpty()
  time_start: string;

  @ApiProperty()
  @IsNotEmpty()
  time_end: string;
}
