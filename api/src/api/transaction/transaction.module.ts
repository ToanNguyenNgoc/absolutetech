import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModel, TransactionSchema } from 'src/models';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionModel.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
