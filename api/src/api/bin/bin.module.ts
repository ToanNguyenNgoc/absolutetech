import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BinConfigureModel,
  BinConfigureSchema,
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
      { name: SpareModel.name, schema: SpareSchema },
      { name: User.name, schema: UserSchema },
      { name: BinModel.name, schema: BinSchema },
      { name: BinConfigureModel.name, schema: BinConfigureSchema },
    ]),
  ],
  controllers: [BinController],
})
export class BinModule {}
