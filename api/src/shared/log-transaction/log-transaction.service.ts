/* eslint-disable @typescript-eslint/no-floating-promises */
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME } from 'src/constants';

export class LogTransactionService {
  constructor(
    @InjectQueue(QUEUE_NAME.log_transaction)
    private readonly logTransactionQueue: Queue,
  ) {}

  post() {
    const data = 123;
    this.logTransactionQueue.add(data, { delay: 1000 });
    return;
  }
}
