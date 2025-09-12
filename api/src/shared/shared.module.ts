import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EntryLogRaw,
  EntryLogRawSchema,
} from 'src/entry-log-raw/entry-log-raw.schema';
import { EntryLog, EntryLogSchema } from 'src/entry-log/entry-log.schema';
import { EntryLogService } from 'src/entry-log/entry-log.service';
// import { MqttModule } from 'src/mqtt/mqtt.module';
import { ExternalModule } from 'src/external/external.module';
import {
  UserFinger,
  UserFingerSchema,
} from 'src/user-finger/user-finger.schema';
import { UserFingerService } from 'src/user-finger/user-finger.service';
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { LogTransactionModule } from './log-transaction/log-transaction.module';
import { UserSettingSalaryModel, UserSettingSalarySchema } from 'src/models';
import { DaySalaryCheckModule } from './day-salary-check/day-salary-check.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EntryLog.name, schema: EntryLogSchema },
      { name: EntryLogRaw.name, schema: EntryLogRawSchema },
      { name: UserFinger.name, schema: UserFingerSchema },
      { name: UserSettingSalaryModel.name, schema: UserSettingSalarySchema },
    ]),
    // MqttModule,
    ExternalModule,
    LogTransactionModule,
    DaySalaryCheckModule,
  ],
  providers: [UserService, EntryLogService, UserFingerService],
  exports: [
    UserService,
    EntryLogService,
    UserFingerService,
    MongooseModule,
    // MqttModule,
    ExternalModule,
  ],
})
export class SharedModule {}
