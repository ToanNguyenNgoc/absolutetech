import { Global, Module } from '@nestjs/common';
import { BaseGateway } from './base/base-gateway.gateway';
import { SyncDataGateway } from './sync-data/sync-data.gateway';

@Global()
@Module({
  providers: [BaseGateway, SyncDataGateway],
  exports: [BaseGateway, SyncDataGateway],
})
export class GatewayModule {}
