/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import { RequestLogModel } from 'src/models';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @InjectModel(RequestLogModel.name)
    private readonly requestLogModel: Model<RequestLogModel>,
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any[] = [];

    // 1. HttpException (NestJS)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResp = exception.getResponse();

      if (typeof exResp === 'object' && exResp !== null) {
        message = (exResp as any).message || message;
        errors = (exResp as any).errors || [];
      } else if (Array.isArray(exResp)) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Validation error';
        errors = exResp.map((errStr: string) => parseValidationError(errStr));
      } else if (typeof exResp === 'string') {
        message = exResp;
      }
    }

    // 2. Mongoose ValidationError
    else if (exception?.name === 'ValidationError') {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = 'Database validation error';
      errors = Object.entries(exception.errors || {}).map(
        ([field, err]: any) => ({
          field,
          message: err?.message,
          kind: err?.kind,
          value: err?.value,
        }),
      );
    }

    // 3. Mongoose CastError
    else if (exception?.name === 'CastError') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data type';
      errors = [
        {
          field: exception.path,
          message: `Expected ${exception.kind}, received ${typeof exception.value}`,
          value: exception.value,
        },
      ];
    }

    // 4. MongoDB Duplicate Key, etc.
    else if (exception?.code === 11000) {
      status = HttpStatus.CONFLICT;
      message = 'Duplicate key error';
      errors = [
        {
          field: Object.keys(exception.keyPattern || {})[0],
          message: 'Already exists',
        },
      ];
    }

    // 5. JS Runtime errors (TypeError, ReferenceError, etc.)
    else if (exception instanceof Error) {
      message = exception.message;
      errors = [{ message: exception.stack?.split('\n')[0] || message }];
    }

    // 6. Unknown error
    else {
      errors = [{ message: 'Unknown error', detail: exception }];
    }
    const data = {
      status,
      message,
      errors,
      timestamp,
      path: request.url,
    };
    response.status(status).json(data);
  }
}

function parseValidationError(str: string) {
  const tokens = str.split(' ');
  if (tokens.length > 1) {
    const field = tokens[0];
    const message = tokens.slice(1).join(' ');
    return { field, message };
  }
  return { field: 'unknown', message: str };
}
