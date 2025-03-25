import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('api/hikvision')
export class HikvisionController {
  @Post('event')
  hikvision(
    @Body()
    data,
  ) {
    console.log(data);
  }
  @Post('listening')
  hikvisionListening(@Req() request: Request) {
    console.log(request.body);
  }
}
