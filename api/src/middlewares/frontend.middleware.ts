import { Injectable, NestMiddleware } from '@nestjs/common';
import { join } from 'path';
import { Request, Response } from 'express';

@Injectable()
export class FrontendMiddleware  implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    if (req.originalUrl.match(/\.[^\/]+$/)) {
      return next();
    }
    return res.sendFile(join(__dirname, '..', '..', 'public', 'dist', 'index.html'));
  }
}
