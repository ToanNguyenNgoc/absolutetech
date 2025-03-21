import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IsUniqueUserConstraint } from './validators/is-unique-user.decorator';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SharedModule,
  ],
  providers: [UserService, IsUniqueUserConstraint],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
