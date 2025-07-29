import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostMediaFromUrl {
  @ApiProperty()
  @IsNotEmpty()
  from_url: string;
}
