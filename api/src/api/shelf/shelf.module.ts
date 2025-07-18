import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClusterModel,
  ClusterSchema,
  ShelfModel,
  ShelfSchema,
} from 'src/models';
import { ShelfController } from './shelf.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClusterModel.name, schema: ClusterSchema },
      { name: ShelfModel.name, schema: ShelfSchema },
    ]),
  ],
  controllers: [ShelfController],
})
export class ShelfModule {}
