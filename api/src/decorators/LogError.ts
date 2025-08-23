import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { EventErrorInterceptor } from 'src/interceptors/event-error.interceptor';

export function LogError() {
  return applyDecorators(UseInterceptors(EventErrorInterceptor));
}
