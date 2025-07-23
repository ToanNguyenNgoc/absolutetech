import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

@Schema({
  collection: 'transactions',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class TransactionModel {
  static TYPE_ISSUE = 'issue';
  static TYPE_REPLENISH = 'replenish';
  static TYPE_RETURN = 'return';
  static TYPE_CREATE_BIN_CONFIGURE = 'create_bin_configure';

  static STATUS_DONE = 'done';

  @Prop({ required: false })
  type: string;

  @Prop({ required: false, default: TransactionModel.STATUS_DONE })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  taker: mongoose.Types.ObjectId;

  @Prop({ required: false })
  signature_taker: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobNumberModel',
  })
  job_number: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionModel);
export type TransactionDocument = TransactionModel & Document;
TransactionSchema.plugin(mongooseLeanVirtuals);
TransactionSchema.virtual('id').get(function () {
  return this._id.toString();
});
