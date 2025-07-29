/* eslint-disable @typescript-eslint/no-floating-promises */
import { InjectQueue } from '@nestjs/bull';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Queue } from 'bull';
import { Request } from 'express';
import { QUEUE_NAME } from 'src/constants';

@Injectable()
export class LogRequestMiddleware implements NestMiddleware {
  constructor(
    @InjectQueue(QUEUE_NAME.log_request)
    private readonly queue: Queue,
  ) {}
  use(req: Request, res: Response, next) {
    if (req.originalUrl?.includes('ignore_log')) {
      return next();
    }
    const dataLog = {
      api_url: req.originalUrl,
      remote_ip: req.ip || req.connection?.remoteAddress,
      method: req.method,
      header: JSON.stringify(req.headers),
      user_agent: req.headers['user-agent'],
      query: JSON.stringify(req.query),
      body: JSON.stringify(req.body),
      auth: req.headers.authorization,
    };
    this.queue.add(dataLog, { delay: 1000 });
    return next();
  }
}
