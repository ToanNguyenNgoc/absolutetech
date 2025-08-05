/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BinConfigureModel,
  BinConfigureSchema,
  TransactionDetailModel,
  TransactionDetailSchema,
  TransactionModel,
  TransactionSchema
} from 'src/models';
import { ReplenishController } from './replenish.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: BinConfigureModel.name, schema: BinConfigureSchema },
    { name: TransactionModel.name, schema: TransactionSchema },
    { name: TransactionDetailModel.name, schema: TransactionDetailSchema },
  ])],
  controllers:[ReplenishController]
})
export class ReplenishModule { }
