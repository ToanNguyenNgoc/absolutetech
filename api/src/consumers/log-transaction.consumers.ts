import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAME } from 'src/constants';

@Processor(QUEUE_NAME.log_transaction)
@Injectable()
export class LogTransactionConsumers {
  @Process()
  async handle(job: Job<any>) {
    console.log(job.data);
    console.log('Start queue');
    return;
  }
}
