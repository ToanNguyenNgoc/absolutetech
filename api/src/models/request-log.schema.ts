import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'request_logs',
  timestamps: true,
})
export class RequestLogModel {
  @Prop({ required: false })
  api_url: string;

  @Prop({ required: false })
  remote_ip: string;

  @Prop({ required: false })
  method: string;

  @Prop({ required: false })
  header: string;

  @Prop({ required: false })
  user_agent: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: mongoose.Types.ObjectId;

  @Prop({ required: false })
  user_payload: string;

  @Prop({ required: false })
  query: string;

  @Prop({ required: false })
  body: string;

  @Prop({ required: false })
  auth: string;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLogModel);
export type RequestLogDocument = RequestLogModel & Document;

RequestLogSchema.plugin(mongooseLeanVirtuals);
RequestLogSchema.virtual('id').get(function () {
  return this._id?.toString?.() ?? null;
});
