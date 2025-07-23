import { Module } from '@nestjs/common';
import { SpareModule } from './spare/spare.module';
import { ClusterModule } from './cluster/cluster.module';
import { ShelfModule } from './shelf/shelf.module';
import { BinModule } from './bin/bin.module';
import { VehicleTypeModule } from './vehicle-type/vehicle-type.module';
import { VehicleModule } from './vehicel/vehicle.module';
import { JobCardModule } from './job-card/job-card.module';
import { ProjectRequestModule } from './project-request/project-request.module';
import { BinConfigureModule } from './bin-configure/bin-configure.module';
import { MediaModule } from './media/media.module';
import { IssuingModule } from './issuing/issuing.module';

@Module({
  imports: [
    BinModule,
    BinConfigureModule,
    ClusterModule,
    JobCardModule,
    IssuingModule,
    ShelfModule,
    SpareModule,
    ProjectRequestModule,
    VehicleTypeModule,
    VehicleModule,
    MediaModule,
  ],
})
export class ApiModule {}
