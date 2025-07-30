/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { QUEUE_NAME } from 'src/constants';
import { RequestLogDocument, RequestLogModel } from 'src/models';

@Processor(QUEUE_NAME.log_request)
@Injectable()
export class LogRequestConsumers {
  constructor(
    @InjectModel(RequestLogModel.name)
    private readonly requestLogModel: Model<RequestLogDocument>,
    private jwtService: JwtService,
  ) {}
  @Process()
  async handle(job: Job<any>) {
    try {
      const decode = this.getUserFromToken(job.data?.auth);
      await this.requestLogModel.create({
        user: decode?.sub,
        user_payload: decode ? JSON.stringify(decode) : null,
        ...job.data,
      });
    } catch (error) {}
    return;
  }

  getUserFromToken(authHeader: string) {
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = this.jwtService.decode(token);
      return decoded;
    } catch (err) {
      return null;
    }
  }
}
