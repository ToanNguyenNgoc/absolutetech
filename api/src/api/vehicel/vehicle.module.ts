import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VehicleModel,
  VehicleSchema,
  VehicleTypeModel,
  VehicleTypeSchema,
} from 'src/models';
import { VehicleController } from './vehicle.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleTypeModel.name, schema: VehicleTypeSchema },
      { name: VehicleModel.name, schema: VehicleSchema },
    ]),
  ],
  controllers: [VehicleController],
})
export class VehicleModule {}
