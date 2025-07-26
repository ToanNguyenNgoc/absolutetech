import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'bin_configures',
  timestamps: true,
})
export class BinConfigureModel {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BinModel',
  })
  bin: mongoose.Types.ObjectId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpareModel',
  })
  spare: mongoose.Types.ObjectId;

  @Prop({ required: false })
  critical: number;

  @Prop({ required: false })
  quantity_org: number;

  @Prop({ required: false })
  quantity_oh: number;

  @Prop({ required: false })
  quantity_damage: number;

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

  @Prop({ required: false })
  rfid: string;

  @Prop({ required: false, default: false })
  has_verification: boolean;

  @Prop({ required: false })
  bar_code_qr_code: string;

  @Prop({ required: false, default: false })
  has_charge_time: boolean;

  @Prop({ required: false })
  charge_time: Date;

  @Prop({ required: false, default: false })
  has_calibration_due: boolean;

  @Prop({ required: false })
  calibration_due: Date;

  @Prop({ required: false, default: false })
  has_expiry_date: boolean;

  @Prop({ required: false, default: null })
  expiry_date: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const BinConfigureSchema =
  SchemaFactory.createForClass(BinConfigureModel);
export type BinConfigureDocument = BinConfigureModel &
  Document & { _id: Types.ObjectId };

/**
 * Start
 *Thêm đoạn này cho tablet
 */

BinConfigureSchema.plugin(mongooseLeanVirtuals);
BinConfigureSchema.virtual('id').get(function () {
  return this._id?.toString?.() ?? null;
});

BinConfigureSchema.virtual('bin_id').get(function () {
  return this.bin?._id?.toString?.() ?? null;
});

BinConfigureSchema.virtual('spare_id').get(function () {
  return this.spare?._id?.toString?.() ?? null;
});

BinConfigureSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'bin_id',
    'spare_id',
    'critical',
    'quantity_org',
    'quantity_oh',
    'quantity_damage',
    'quantity',
    'min',
    'max',
    'description',
    'batch_no',
    'order',
    'serial_no',
    'rfid',
    'has_verification',
    'bar_code_qr_code',
    'has_charge_time',
    'expiry_date',
    'has_expiry_date',
    'charge_time',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

/**
 * End
 *Thêm đoạn này cho tablet
 */

BinConfigureSchema.virtual('id').get(function () {
  return this._id.toString();
});
// Soft delete middleware
BinConfigureSchema.pre(
  ['find', 'findOne', 'findOneAndUpdate'],
  function (next) {
    this.where({ deletedAt: null }); // Only return non-deleted documents
    next();
  },
);

// Method to soft delete a bin configure
BinConfigureSchema.statics.softDelete = async function (id: string) {
  return this.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};
