import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'sync_data', timestamps: true })
export class SyncData {
  @Prop({ type: String, required: false, default: null })
  device_id?: string;

  @Prop({ type: String, required: false, default: null })
  timestamp_fetch?: string;

  @Prop({ type: String, required: false, default: null })
  timestamp_push?: string;

  @Prop({ type: String, required: false, default: null })
  data?: string;
}

export const SyncDataSchema = SchemaFactory.createForClass(SyncData);
