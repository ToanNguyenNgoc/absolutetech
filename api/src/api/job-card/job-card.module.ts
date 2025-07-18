import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobCardModel, JobCardSchema } from 'src/models/job-card.scheme';
import { JobCardController } from './job-card.controller';
import { VehicleModel, VehicleSchema } from 'src/models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleModel.name, schema: VehicleSchema },
      { name: JobCardModel.name, schema: JobCardSchema },
    ]),
  ],
  controllers: [JobCardController],
})
export class JobCardModule {}
