import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('ping')
  getHello(): string {
    return 'Hello World!';
  }
}
