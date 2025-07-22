import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModel, TransactionSchema } from 'src/models';
import { LogTransactionService } from './log-transaction.service';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import { LogTransactionConsumers } from 'src/consumers/log-transaction.consumers';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionModel.name, schema: TransactionSchema },
    ]),
    BullModule.registerQueue({ name: QUEUE_NAME.log_transaction }),
  ],
  providers: [LogTransactionService, LogTransactionConsumers],
  exports: [LogTransactionService],
})
export class LogTransactionModule {}
