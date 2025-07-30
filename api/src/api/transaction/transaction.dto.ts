import { ApiProperty } from '@nestjs/swagger';
import { BaseQuery } from 'src/common';
import { TransactionModel } from 'src/models';

export class TransactionQr extends BaseQuery {
  @ApiProperty({
    required: false,
    description: `Multiple value supported: 
    ${TransactionModel.TYPE_CREATE_BIN_CONFIGURE}|${TransactionModel.TYPE_ISSUE}|${TransactionModel.TYPE_ISSUE_IMAGE}|${TransactionModel.TYPE_REPLENISH}|${TransactionModel.TYPE_RETURN}
    `,
  })
  types: string;
  @ApiProperty({ required: false, description: `ISO string: '2025-07-01'` })
  start_date?: string;
  @ApiProperty({ required: false, description: ` ISO string: '2025-07-29'` })
  end_date?: string;
}
