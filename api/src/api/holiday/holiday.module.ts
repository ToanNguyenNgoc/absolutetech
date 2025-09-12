import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolidayModel, HolidaySchema } from 'src/models';
import { HolidayController } from './holiday.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HolidayModel.name, schema: HolidaySchema },
    ]),
  ],
  controllers: [HolidayController],
})
export class HolidayModule {}
