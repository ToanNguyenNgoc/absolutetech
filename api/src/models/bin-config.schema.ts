import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'bin_configures',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class BinConfigModel {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BinModel',
  })
  bin_origin: mongoose.Types.ObjectId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BinModel',
  })
  bin: mongoose.Types.ObjectId;

  @Prop({ required: false })
  critical: number;

  @Prop({ required: false })
  quantity_org: number;

  @Prop({ required: false })
  quantity: number;

  @Prop({ required: false })
  min: number;

  @Prop({ required: false })
  max: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  order: number;

  @Prop({ required: false })
  batch_no: string;

  @Prop({ required: false })
  serial_no: string;

  @Prop({ required: false, default: false })
  has_verification: boolean;

  @Prop({ required: false })
  bar_code_qr_code: string;

  // @Prop({ required: false, default: false })
  // has_charge_time: boolean;

  @Prop({ required: false })
  charge_time: Date;

  // @Prop({ required: false, default: false })
  // has_calibration_due: boolean;

  @Prop({ required: false })
  calibration_due: Date;

  // @Prop({ required: false, default: false })
  // has_expiry_date: boolean;

  @Prop({ required: false, default: false })
  expiry_date: Date;

  @Prop({ required: false })
  load_hydrostatic_test_due: Date;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const BinConfigSchema = SchemaFactory.createForClass(BinConfigModel);
export type BinConfigDocument = BinConfigModel & Document;

BinConfigSchema.plugin(mongooseLeanVirtuals);
BinConfigSchema.virtual('id').get(function () {
  return this._id.toString();
});
