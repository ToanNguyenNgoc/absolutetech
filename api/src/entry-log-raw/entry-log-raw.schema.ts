import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EntryLogRawDocument = EntryLogRaw & Document;

@Schema({ collection: 'entry_logs_raw', timestamps: true })
export class EntryLogRaw {
  @Prop({ required: true })
  employeeNoString: string;

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
}

export const EntryLogRawSchema = SchemaFactory.createForClass(EntryLogRaw);
