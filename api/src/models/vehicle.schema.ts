import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'vehicles',
  timestamps: true,
})
export class VehicleModel {
  static status_open = 'open';
  static status_close = 'close';

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  vehicle_num: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleTypeModel',
  })
  vehicle_type: mongoose.Types.ObjectId;

  @Prop({ required: false })
  variant: string;

  @Prop({ required: false })
  unit: string;

  @Prop({ required: false })
  unit_other: string;

  @Prop({ required: false })
  mileage_start: string;

  @Prop({ required: false })
  mileage_end: string;

  @Prop({ required: false, default: false })
  t_loan: boolean;

  @Prop({ required: false, default: false })
  unserviceable: boolean;

  @Prop({ required: false })
  last_point_servicing: string;

  @Prop({ required: false })
  schedule_6_months: string;

  @Prop({ required: false })
  completion_date_6_months: string;

  @Prop({ required: false })
  schedule_12_months: string;

  @Prop({ required: false })
  completion_date_12_months: string;

  @Prop({ required: false })
  schedule_18_months: string;

  @Prop({ required: false })
  completion_date_18_months: string;

  @Prop({ required: false })
  schedule_24_months: string;

  @Prop({ required: false })
  completion_date_24_months: string;

  @Prop({ required: false, default: VehicleModel.status_open })
  status: string;

  @Prop({ required: false, default: true })
  is_active: boolean;

  @Prop({ required: false })
  tracker_no: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  created_by: mongoose.Types.ObjectId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  updated_by: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(VehicleModel);
export type VehicleDocument = VehicleModel & Document;

VehicleSchema.plugin(mongooseLeanVirtuals);
VehicleSchema.virtual('id').get(function () {
  return this._id.toString();
});
