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
import { RequestLogModule } from './request-log/request-log.module';
import { TransactionModule } from './transaction/transaction.module';
import { SyncDataLogModule } from './sync-data-log/sync-data-log.module';
import { StatisticModule } from './statistic/statistic.module';
import { ReturnModule } from './return/return.module';
import { ReplenishModule } from './replenish/replenish.module';
import { NormalWorkingHourModule } from './normal-working-hour/normal-working-hour.scheme.module';
import { HolidayModule } from './holiday/holiday.module';
import { SalaryModule } from './salary/salary.module';
import { AppConfigModule } from './app-config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
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
    RequestLogModule,
    StatisticModule,
    SyncDataLogModule,
    ReturnModule,
    ReplenishModule,
    TransactionModule,
    NormalWorkingHourModule,
    HolidayModule,
    SalaryModule,
  ],
})
export class ApiModule {}
