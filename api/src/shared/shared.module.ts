import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EntryLogRaw,
  EntryLogRawSchema,
} from 'src/entry-log-raw/entry-log-raw.schema';
import { EntryLog, EntryLogSchema } from 'src/entry-log/entry-log.schema';
import { EntryLogService } from 'src/entry-log/entry-log.service';
import {
  UserFinger,
  UserFingerSchema,
} from 'src/user-finger/user-finger.schema';
import { UserFingerService } from 'src/user-finger/user-finger.service'; // ⬅ Thêm import này
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EntryLog.name, schema: EntryLogSchema },
      { name: EntryLogRaw.name, schema: EntryLogRawSchema },
      { name: UserFinger.name, schema: UserFingerSchema },
    ]),
  ],
  providers: [UserService, EntryLogService, UserFingerService], // ⬅ Thêm UserFingerService vào đây
  exports: [UserService, EntryLogService, UserFingerService, MongooseModule], // ⬅ Và export nó
})
export class SharedModule {}
