import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'transaction_details',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
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
  deleted_at?: Date;
}

export const TransactionDetailSchema = SchemaFactory.createForClass(
  TransactionDetailModel,
);
export type TransactionDetailDocument = TransactionDetailModel & Document;
TransactionDetailSchema.plugin(mongooseLeanVirtuals);
TransactionDetailSchema.virtual('id').get(function () {
  return this._id.toString();
});
