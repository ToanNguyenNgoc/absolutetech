import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BinConfigureModel,
  BinConfigureSchema,
  IssueCardModel,
  IssueCardSchema,
  IssueModel,
  IssueSchema,
  ProjectRequestModel,
  ProjectRequestSchema,
  TransactionDetailModel,
  TransactionDetailSchema,
  TransactionModel,
  TransactionSchema,
} from 'src/models';
import { ReturnController } from './return.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectRequestModel.name, schema: ProjectRequestSchema },
      { name: IssueCardModel.name, schema: IssueCardSchema },
      { name: IssueModel.name, schema: IssueSchema },
      { name: BinConfigureModel.name, schema: BinConfigureSchema },
      { name: TransactionModel.name, schema: TransactionSchema },
      { name: TransactionDetailModel.name, schema: TransactionDetailSchema },
    ]),
  ],
  controllers: [ReturnController],
})
export class ReturnModule {}
