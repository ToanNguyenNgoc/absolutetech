import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClusterModel, ClusterSchema } from 'src/models';
import { ClusterController } from './cluster.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClusterModel.name, schema: ClusterSchema },
    ]),
  ],
  controllers: [ClusterController],
})
export class ClusterModule {}
