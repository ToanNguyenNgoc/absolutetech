import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export type EntryLogRawDocument = EntryLogRaw & Document;

@Schema({ collection: 'entry_logs_raw', timestamps: true })
export class EntryLogRaw {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  employee_no_string: string;

  @Prop({ required: true, unique: true })
  serial_no: number;

  @Prop()
  name?: string;

  @Prop()
  door_no?: number;

  @Prop({ required: true })
  time: Date;

  @Prop()
  major?: number;

  @Prop()
  minor?: number;

  @Prop()
  current_verify_mode: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'EntryLog' })
  entry_log_id?: Types.ObjectId;
}

export const EntryLogRawSchema = SchemaFactory.createForClass(EntryLogRaw);

EntryLogRawSchema.virtual('id').get(function () {
  return this._id.toString();
});

EntryLogRawSchema.virtual('user_id').get(function () {
  return this.user._id.toString();
});

EntryLogRawSchema.plugin(mongooseLeanVirtuals);
