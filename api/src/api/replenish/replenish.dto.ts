import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { BaseQuery } from 'src/common';

export class ReplenishBinConfigureQr extends BaseQuery {}

export class BinConfigureItem {
  @ApiProperty()
  @IsNotEmpty()
  bin_configure_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity_replenish: number;
}
export class ReplenishBinConfigureDto {
  @ApiProperty()
  @IsOptional()
  taker_id: string;

  @ApiProperty()
  @IsOptional()
  signature_taker: string;

  @ApiProperty({
    type: [BinConfigureItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BinConfigureItem)
  bin_configures: BinConfigureItem[];
}
