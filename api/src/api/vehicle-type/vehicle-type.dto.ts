import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common';

export class VehicleTypeQr extends BaseQuery {}
export class VehicleTypeCreate {
  @IsOptional()
  @ApiProperty()
  name: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
