import { Module } from '@nestjs/common';
import { HikvisionController } from './hikvision.controller';

@Module({
  controllers: [HikvisionController],
})
export class HikvisionModule {}
