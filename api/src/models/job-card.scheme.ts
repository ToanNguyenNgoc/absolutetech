import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'job_cards',
  timestamps: true,
})
export class JobCardModel {
  @Prop({ required: false })
  card_num: string;

  @Prop({ required: false })
  wo: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleModel',
  })
  vehicle: mongoose.Types.ObjectId;

  @Prop({ required: false })
  platform: string;

  @Prop({ required: false, default: true })
  is_active: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const JobCardSchema = SchemaFactory.createForClass(JobCardModel);
export type JobCardDocument = JobCardModel & Document;

JobCardSchema.plugin(mongooseLeanVirtuals);
JobCardSchema.virtual('id').get(function () {
  return this._id.toString();
});
