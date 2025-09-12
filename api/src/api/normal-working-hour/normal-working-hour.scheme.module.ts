import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NormalWorkingHourModel, NormalWorkingHourSchema } from 'src/models';
import { NormalWorkingHourController } from './normal-working-hour.scheme.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NormalWorkingHourModel.name, schema: NormalWorkingHourSchema },
    ]),
  ],
  controllers: [NormalWorkingHourController],
})
export class NormalWorkingHourModule {}
