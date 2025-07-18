import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BinModel,
  BinSchema,
  ClusterModel,
  ClusterSchema,
  ShelfModel,
  ShelfSchema,
  SpareModel,
  SpareSchema,
} from 'src/models';
import { BinController } from './bin.controller';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClusterModel.name, schema: ClusterSchema },
      { name: ShelfModel.name, schema: ShelfSchema },
      { name: User.name, schema: UserSchema },
      { name: BinModel.name, schema: BinSchema },
      { name: SpareModel.name, schema: SpareSchema },
    ]),
  ],
  controllers: [BinController],
})
export class BinModule {}
