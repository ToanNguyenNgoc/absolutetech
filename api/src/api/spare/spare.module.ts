import { Module } from '@nestjs/common';
import { SpareController } from './spare.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpareModel, SpareSchema } from 'src/models';
import { SpareService } from './spare.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SpareModel.name, schema: SpareSchema }]),
  ],
  controllers: [SpareController],
  providers: [SpareService],
})
export class SpareModule {}
