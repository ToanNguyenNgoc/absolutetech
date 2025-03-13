import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

export type EntryLogDocument = EntryLog & Document;

@Schema({ collection: 'entry_logs' })
export class EntryLog {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;


  @Prop({ required: true })
  date: Date;


  @Prop({ required: true })
  timeIn: Date;


  @Prop()
  timeOut?: Date;


  @Prop()
  duration?: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const EntryLogSchema = SchemaFactory.createForClass(EntryLog);
