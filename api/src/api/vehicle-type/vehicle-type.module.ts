import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleTypeModel, VehicleTypeSchema } from 'src/models';
import { VehicleTypeController } from './vehicle-type.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleTypeModel.name, schema: VehicleTypeSchema },
    ]),
  ],
  controllers: [VehicleTypeController],
})
export class VehicleTypeModule {}
