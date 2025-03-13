import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryLog, EntryLogSchema } from 'src/entry-log/entry-log.schema';
import { EntryLogService } from 'src/entry-log/entry-log.service';
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EntryLog.name, schema: EntryLogSchema },
    ]),
  ],
  providers: [UserService, EntryLogService],
  exports: [UserService, EntryLogService, MongooseModule],
})
export class SharedModule {}
