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

export class ReturnIssueCardQr extends BaseQuery {}

class IssueCardItem {
  @ApiProperty()
  @IsNotEmpty()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  issue_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity_return: number;
}

class Item {
  @ApiProperty()
  @IsNotEmpty()
  project_request: string;

  @ApiProperty({
    type: [IssueCardItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IssueCardItem)
  issue_cards: IssueCardItem[];
}

export class PostReturnIssueCard {
  @ApiProperty({
    type: [Item],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];

  @ApiProperty()
  @IsOptional()
  taker_id: string;

  @ApiProperty()
  @IsOptional()
  signature_taker: string;
}
