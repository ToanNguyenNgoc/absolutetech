import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UploadController } from './upload/upload.controller';
import { EntryLogModule } from './entry-log/entry-log.module';
import { FrontendMiddleware } from './frontend.middleware';
import { HikvisionModule } from './hikvision/hikvision.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EntryLogRawModule } from './entry-log-raw/entry-log-raw.module';
import { UserFingerModule } from './user-finger/user-finger.module';
import { JobNumberModule } from './job-number/job-number.module';

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
    ),
    MongooseModule.forRoot(process.env.MONGODB_URI || '', {
      dbName: process.env.MONGODB_DB_NAME,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    EntryLogModule,
    EntryLogRawModule,
    HikvisionModule,
    UserFingerModule,
    JobNumberModule,
  ],

  controllers: [UploadController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FrontendMiddleware).forRoutes('*');
  }
}
