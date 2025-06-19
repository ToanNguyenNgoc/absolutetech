import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WarehouseService } from './warehouse.service';

@Module({
  imports: [HttpModule],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class ExternalModule {}
