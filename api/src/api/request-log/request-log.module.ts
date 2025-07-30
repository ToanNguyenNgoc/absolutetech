import { Module } from '@nestjs/common';
import { RequestLogController } from './request-log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLogModel, RequestLogSchema } from 'src/models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestLogModel.name, schema: RequestLogSchema },
    ]),
  ],
  controllers: [RequestLogController],
})
export class RequestLogModule {}
