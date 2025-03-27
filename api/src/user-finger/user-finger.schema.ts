import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserFingerDocument = UserFinger & Document;

@Schema({ collection: 'user_finger', timestamps: true })
export class UserFinger {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop()
  no?: number;

  @Prop()
  finger_data?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserFingerSchema = SchemaFactory.createForClass(UserFinger);
