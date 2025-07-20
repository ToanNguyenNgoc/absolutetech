import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BinConfigureModel,
  BinConfigureSchema,
  BinModel,
  BinSchema,
  SpareModel,
  SpareSchema,
} from 'src/models';
import { BinConfigureController } from './bin-configure.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BinConfigureModel.name, schema: BinConfigureSchema },
      { name: BinModel.name, schema: BinSchema },
      { name: SpareModel.name, schema: SpareSchema },
    ]),
  ],
  controllers: [BinConfigureController],
})
export class BinConfigureModule {}
