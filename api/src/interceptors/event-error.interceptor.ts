import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError, catchError, tap } from 'rxjs';

@Injectable()
export class EventErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcCtx = context.switchToRpc();
    const data = rpcCtx.getData();

    return next.handle().pipe(
      tap(() => {
        console.log('[Payload]', JSON.stringify(data));
      }),
      catchError((err) => {
        console.log('LOI....');
        return throwError(() => err);
      }),
    );
  }
}
