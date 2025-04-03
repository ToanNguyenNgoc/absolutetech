import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EntryLogRawDocument = EntryLogRaw & Document;

@Schema({ collection: 'entry_logs_raw', timestamps: true })
export class EntryLogRaw {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  employeeNoString: string;

  @Prop({ required: true, unique: true })
  serialNo: number;

  @Prop()
  name?: string;

  @Prop()
  doorNo?: number;

  @Prop({ required: true })
  time: Date;

  @Prop()
  major?: number;

  @Prop()
  minor?: number;

  @Prop()
  currentVerifyMode: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'EntryLog' })
  entry_log_id?: Types.ObjectId;
}

export const EntryLogRawSchema = SchemaFactory.createForClass(EntryLogRaw);
