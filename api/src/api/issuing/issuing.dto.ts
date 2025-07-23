/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';
import { TransactionModel } from 'src/models';

export class IssuingItemCreate {
  @ApiProperty()
  @IsNotEmpty()
  id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'quantity_issue must be greater than 0' })
  quantity_issue: number
}

export class IssuingCreate {
  @ApiProperty({ default: TransactionModel.TYPE_ISSUE })
  @IsNotEmpty()
  @IsIn([TransactionModel.TYPE_ISSUE, TransactionModel.TYPE_REPLENISH, TransactionModel.TYPE_RETURN])
  type: string

  @ApiProperty()
  @IsNotEmpty()
  job_number_id: string;

  @ApiProperty({
    type: [IssuingItemCreate],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IssuingItemCreate)
  issues: IssuingItemCreate[];

  @ApiProperty()
  @IsNotEmpty()
  taker_id: string

  @ApiProperty()
  signature_taker: string;
}
