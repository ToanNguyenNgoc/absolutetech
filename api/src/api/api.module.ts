import { Module } from '@nestjs/common';
import { SpareModule } from './spare/spare.module';
import { ClusterModule } from './cluster/cluster.module';
import { ShelfModule } from './shelf/shelf.module';
import { BinModule } from './bin/bin.module';
import { VehicleTypeModule } from './vehicle-type/vehicle-type.module';
import { VehicleModule } from './vehicel/vehicle.module';
import { JobCardModule } from './job-card/job-card.module';

@Module({
  imports: [
    BinModule,
    ClusterModule,
    JobCardModule,
    ShelfModule,
    SpareModule,
    VehicleTypeModule,
    VehicleModule,
  ],
})
export class ApiModule {}
