import { Module } from '@nestjs/common';
import { IssuingController } from './issuing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobNumber,
  JobNumberSchema,
} from 'src/job-number/schemas/job-number.schema';
import {
  BinConfigureModel,
  BinConfigureSchema,
  IssueModel,
  IssueSchema,
  TransactionDetailModel,
  TransactionDetailSchema,
  TransactionModel,
  TransactionSchema,
} from 'src/models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BinConfigureModel.name, schema: BinConfigureSchema },
      { name: JobNumber.name, schema: JobNumberSchema },
      { name: IssueModel.name, schema: IssueSchema },
      { name: TransactionModel.name, schema: TransactionSchema },
      { name: TransactionDetailModel.name, schema: TransactionDetailSchema },
    ]),
  ],
  controllers: [IssuingController],
})
export class IssuingModule {}
