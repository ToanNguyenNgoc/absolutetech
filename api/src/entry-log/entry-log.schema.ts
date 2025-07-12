import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type EntryLogDocument = EntryLog & Document;

@Schema({ collection: 'entry_logs' })
export class EntryLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

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

EntryLogSchema.virtual('id').get(function () {
  return this._id.toString();
});

EntryLogSchema.virtual('user_id').get(function () {
  return this.user._id.toString();
});

EntryLogSchema.plugin(mongooseLeanVirtuals);

EntryLogSchema.virtual('rawLogs', {
  ref: 'EntryLogRaw',
  localField: '_id',
  foreignField: 'entry_log_id',
});

EntryLogSchema.set('toObject', { virtuals: true });
EntryLogSchema.set('toJSON', { virtuals: true });
