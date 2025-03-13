import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request  = ctx.getRequest<Request>();

    let status  = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResp = exception.getResponse();

      // If the response is an object
      if (typeof exResp === 'object' && exResp !== null) {
        console.log('exResp', exResp);
        message = (exResp as any).message || message;
        errors = (exResp as any).errors || [];
      }
      // If the response is an array of strings (Nest default for validation errors)
      else if (Array.isArray(exResp)) {
        // We'll treat this as a validation error
        status = HttpStatus.BAD_REQUEST;
        message = 'Validation error';
        // Convert ["username should not be empty", ...] -> [{ field, message }, ...]
        errors = exResp.map((errStr: string) => parseValidationError(errStr));
      }
      // If it's just a string
      else if (typeof exResp === 'string') {
        message = exResp;
      }
    }

    response.status(status).json({
      status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
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
