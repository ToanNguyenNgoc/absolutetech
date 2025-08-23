import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { EntryLogRawModule } from './entry-log-raw/entry-log-raw.module';
import { EntryLogModule } from './entry-log/entry-log.module';
import { JobNumberModule } from './job-number/job-number.module';
// import { MqttModule } from './mqtt/mqtt.module';
import { SyncDataModule } from './sync-data/sync-data.module';
import { TimesheetDetailModule } from './timesheet-detail/timesheet-detail.module';
import { TimesheetModule } from './timesheet/timesheet.module';
import { UploadController } from './upload/upload.controller';
import { UserFingerModule } from './user-finger/user-finger.module';
import { UserModule } from './user/user.module';
import { GatewayModule } from './gateway/gateway.module';
import { BullModule } from '@nestjs/bull';
// import { bullConfig } from './configs';
import { ApiModule } from './api/api.module';
import { FrontendMiddleware, LogRequestMiddleware } from './middlewares';
import { QUEUE_NAME } from './constants';
import { LogRequestConsumers } from './consumers/log-request.consumer';
import { RequestLogModel, RequestLogSchema } from './models';
import { JwtService } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'uploads'),
        serveRoot: '/api/uploads',
      },
      {
        rootPath: join(__dirname, '..', '..', 'public', 'dist'),
        exclude: ['/api*'],
      },
      {
        rootPath: join(__dirname, '..', '..', 'public', 'dist'),
        exclude: ['/docs*'],
      },
    ),
    MongooseModule.forRoot(process.env.MONGODB_URI || '', {
      dbName: process.env.MONGODB_DB_NAME,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    // MqttModule,
    UserModule,
    AuthModule,
    EntryLogModule,
    EntryLogRawModule,
    UserFingerModule,
    JobNumberModule,
    SyncDataModule,
    TimesheetModule,
    TimesheetDetailModule,
    ApiModule,
    //Socket gateway
    GatewayModule,
    BullModule.registerQueue({ name: QUEUE_NAME.log_request }),
    MongooseModule.forFeature([
      { name: RequestLogModel.name, schema: RequestLogSchema },
    ]),
  ],

  controllers: [UploadController],
  providers: [
    LogRequestConsumers,
    JwtService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FrontendMiddleware, LogRequestMiddleware).forRoutes('*');
  }
}
