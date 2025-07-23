import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'transaction_details',
  timestamps: true,
})
export class TransactionDetailModel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransactionModel',
    required: false,
  })
  transaction: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IssueModel',
    required: false,
  })
  issue: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BinConfigureModel',
    required: false,
  })
  bin_configure: mongoose.Types.ObjectId;

  @Prop({ required: false })
  quantity: number;

  @Prop({ required: false })
  changed_qty: number;

  @Prop({ required: false })
  current_qty: number;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const TransactionDetailSchema = SchemaFactory.createForClass(
  TransactionDetailModel,
);
export type TransactionDetailDocument = TransactionDetailModel & Document;
TransactionDetailSchema.plugin(mongooseLeanVirtuals);

/**
 * Start
 *Thêm đoạn này cho tablet
 */
TransactionDetailSchema.virtual('id').get(function () {
  return this._id?.toString?.() ?? null;
});

TransactionDetailSchema.virtual('issue_id').get(function () {
  return this.issue?._id?.toString?.() ?? null;
});

TransactionDetailSchema.virtual('transaction_id').get(function () {
  return this.transaction?._id?.toString?.() ?? null;
});

TransactionDetailSchema.virtual('bin_configure_id').get(function () {
  return this.bin_configure?._id?.toString?.() ?? null;
});

TransactionDetailSchema.statics.getSyncColumns = function () {
  return [
    'id',
    'status',
    'quantity',
    'changed_qty',
    'current_qty',
    'status',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
};

/**
 * End
 *Thêm đoạn này cho tablet
 */
