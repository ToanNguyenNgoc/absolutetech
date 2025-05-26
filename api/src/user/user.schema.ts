import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender, Role } from './user.enums';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  employeeID: string;

  @Prop({
    type: Number,
    enum: Role,
    default: Role.SUPERVISOR,
  })
  role: Role;

  @Prop()
  position: string;

  @Prop({
    type: String,
    enum: Gender,
  })
  gender: Gender;

  @Prop()
  birthday: Date;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('userFingers', {
  ref: 'UserFinger',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
