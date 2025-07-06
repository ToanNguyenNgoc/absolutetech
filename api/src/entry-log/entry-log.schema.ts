import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

export type EntryLogDocument = EntryLog & Document;

@Schema({ collection: 'entry_logs' })
export class EntryLog {
  @Prop({ type: String, default: () => crypto.randomUUID() })
  id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time_in: Date;

  @Prop()
  time_out?: Date;

  @Prop()
  duration?: number;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const EntryLogSchema = SchemaFactory.createForClass(EntryLog);

EntryLogSchema.pre('save', function (next) {
  if (!this.id) this.id = crypto.randomUUID();
  next();
});
EntryLogSchema.virtual('rawLogs', {
  ref: 'EntryLogRaw',
  localField: '_id',
  foreignField: 'entry_log_id',
});

EntryLogSchema.set('toObject', { virtuals: true });
EntryLogSchema.set('toJSON', { virtuals: true });
