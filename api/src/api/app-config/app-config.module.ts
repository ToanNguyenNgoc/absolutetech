import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolidayModel, HolidaySchema } from 'src/models';
import { AppConfigController } from './app-config.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HolidayModel.name, schema: HolidaySchema },
    ]),
  ],
  controllers: [AppConfigController],
})
export class AppConfigModule {}
