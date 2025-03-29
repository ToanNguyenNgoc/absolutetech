import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFinger, UserFingerSchema } from './user-finger.schema';
import { UserFingerController } from './user-finger.controller';
import { UserFingerService } from './user-finger.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserFinger.name, schema: UserFingerSchema },
    ]),
    SharedModule,
  ],
  controllers: [UserFingerController],
  providers: [UserFingerService],
  exports: [UserFingerService],
})
export class UserFingerModule {}
